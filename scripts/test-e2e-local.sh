#!/usr/bin/env bash
set -euo pipefail

# Local E2E test script - simulates the GitHub Actions e2e workflow
# Usage: ./scripts/test-e2e-local.sh [--skip-publish] [--keep-temp]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
VERDACCIO_PORT=4873
VERDACCIO_REGISTRY="http://localhost:$VERDACCIO_PORT/"
STORYBOOK_VERSION="${STORYBOOK_VERSION:-10.1.0}"
TEMP_DIR="${TEMP_DIR:-$(mktemp -d)}"
SKIP_PUBLISH=false
KEEP_TEMP=false
VERDACCIO_PID=""

# Parse arguments
for arg in "$@"; do
  case $arg in
    --skip-publish)
      SKIP_PUBLISH=true
      shift
      ;;
    --keep-temp)
      KEEP_TEMP=true
      shift
      ;;
    --help|-h)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --skip-publish  Skip building and publishing packages (use existing Verdaccio packages)"
      echo "  --keep-temp     Don't delete the temp directory after the test"
      echo "  --help, -h      Show this help message"
      echo ""
      echo "Environment variables:"
      echo "  STORYBOOK_VERSION  Storybook version to use (default: 10.1.0)"
      echo "  TEMP_DIR           Custom temp directory for the example project"
      exit 0
      ;;
  esac
done

cleanup() {
  echo ""
  echo "🧹 Cleaning up..."

  # Kill Verdaccio if running
  if [[ -n "$VERDACCIO_PID" ]] && kill -0 "$VERDACCIO_PID" 2>/dev/null; then
    echo "   Stopping Verdaccio (PID: $VERDACCIO_PID)"
    kill "$VERDACCIO_PID" 2>/dev/null || true
  fi

  # Clean up temp directory
  if [[ "$KEEP_TEMP" == false && -d "$TEMP_DIR" ]]; then
    echo "   Removing temp directory: $TEMP_DIR"
    rm -rf "$TEMP_DIR"
  else
    echo "   Temp directory kept at: $TEMP_DIR"
  fi
}

trap cleanup EXIT

echo "🚀 Local E2E Test Script"
echo "========================"
echo "Project root: $PROJECT_ROOT"
echo "Temp directory: $TEMP_DIR"
echo "Storybook version: $STORYBOOK_VERSION"
echo ""

# Check if Verdaccio is already running
if curl -s "http://localhost:$VERDACCIO_PORT" > /dev/null 2>&1; then
  echo "⚠️  Verdaccio is already running on port $VERDACCIO_PORT"
  echo "   Using existing instance..."
else
  echo "📦 Starting Verdaccio..."

  # Check if verdaccio is installed
  if ! command -v verdaccio &> /dev/null; then
    echo "   Installing verdaccio and wait-on globally..."
    pnpm install -g verdaccio wait-on
  fi

  # Start Verdaccio in background
  verdaccio --listen $VERDACCIO_PORT &
  VERDACCIO_PID=$!
  echo "   Verdaccio PID: $VERDACCIO_PID"

  # Wait for Verdaccio to be ready
  echo "   Waiting for Verdaccio to start..."
  npx wait-on "http://localhost:$VERDACCIO_PORT" --timeout 30000
  echo "   ✅ Verdaccio is running"
fi

# Create test user and get token
echo ""
echo "🔐 Creating Verdaccio test user..."
TOKEN_RES=$(curl -s -XPUT \
  -H "Content-type: application/json" \
  -d '{ "name": "test", "password": "test" }' \
  "http://localhost:$VERDACCIO_PORT/-/user/org.couchdb.user:test" || echo '{}')

TOKEN=$(echo "$TOKEN_RES" | jq -r '.token // empty')
if [[ -z "$TOKEN" ]]; then
  echo "   ⚠️  Could not get token (user may already exist), continuing..."
else
  echo "   ✅ Got auth token"
  pnpm config set "//localhost:$VERDACCIO_PORT/:_authToken" "$TOKEN"
fi

# Build and publish packages
if [[ "$SKIP_PUBLISH" == false ]]; then
  echo ""
  echo "🔨 Building packages..."
  cd "$PROJECT_ROOT"
  pnpm install
  pnpm jiti prepare-release.ts --nightly

  echo ""
  echo "📤 Publishing to local Verdaccio..."
  pnpm publish --recursive --tag latest --no-git-checks --report-summary --registry "$VERDACCIO_REGISTRY" || {
    echo "   ⚠️  Publish failed (packages may already exist), continuing..."
  }
else
  echo ""
  echo "⏭️  Skipping publish (--skip-publish)"
  echo ""
  echo "🔍 Checking if packages exist in Verdaccio..."

  # Check if @nuxtjs/storybook exists in Verdaccio
  if ! curl -sf "${VERDACCIO_REGISTRY}@nuxtjs%2fstorybook" > /dev/null 2>&1; then
    echo "   ❌ @nuxtjs/storybook not found in Verdaccio!"
    echo "   Run without --skip-publish first to publish packages."
    exit 1
  fi

  if ! curl -sf "${VERDACCIO_REGISTRY}@storybook-vue%2fnuxt" > /dev/null 2>&1; then
    echo "   ❌ @storybook-vue/nuxt not found in Verdaccio!"
    echo "   Run without --skip-publish first to publish packages."
    exit 1
  fi

  echo "   ✅ Packages found in Verdaccio"
fi

# Create sample project
EXAMPLE_DIR="$TEMP_DIR/example"
echo ""
echo "📁 Creating sample Nuxt project at: $EXAMPLE_DIR"

# Use npx to run nuxt init (avoids pnpm requiring a package.json in current dir)
# Redirect stdin from /dev/null to force non-interactive mode
cd "$TEMP_DIR"
CI=true npx nuxi init example --packageManager pnpm --force --gitInit=false < /dev/null

cd "$EXAMPLE_DIR"

# Configure .npmrc to use Verdaccio for our packages
echo ""
echo "⚙️  Configuring .npmrc..."
cat > .npmrc << EOF
registry=https://registry.npmjs.org/
@nuxtjs:registry=$VERDACCIO_REGISTRY
@storybook-vue:registry=$VERDACCIO_REGISTRY
EOF
cat .npmrc

# Install base dependencies first
echo ""
echo "📦 Installing Nuxt dependencies..."
pnpm install

# Install storybook packages from Verdaccio
echo ""
echo "➕ Installing @nuxtjs/storybook and storybook from Verdaccio..."
pnpm add -D "@nuxtjs/storybook@latest" "storybook@$STORYBOOK_VERSION" "@storybook/addon-docs@$STORYBOOK_VERSION"

# Manually create Storybook configuration (skip storybook init which has registry issues)
echo ""
echo "📚 Creating Storybook configuration manually..."

mkdir -p .storybook stories

# Create main.ts
cat > .storybook/main.ts << 'EOF'
import type { StorybookConfig } from '@nuxtjs/storybook'

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@nuxtjs/storybook',
    options: {},
  },
}

export default config
EOF

# Create preview.ts
cat > .storybook/preview.ts << 'EOF'
import type { Preview } from '@nuxtjs/storybook'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
EOF

# Create a sample story
cat > stories/Welcome.stories.ts << 'EOF'
import type { Meta, StoryObj } from '@nuxtjs/storybook'

const meta: Meta = {
  title: 'Welcome',
}

export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => ({
    template: '<div><h1>Welcome to Storybook</h1><p>Your Nuxt + Storybook setup is working!</p></div>',
  }),
}
EOF

# Add storybook scripts to package.json
echo ""
echo "📝 Adding storybook scripts to package.json..."
pnpm pkg set scripts.storybook="storybook dev -p 6006"
pnpm pkg set scripts.build-storybook="storybook build"

echo ""
echo "📦 Final dependency installation..."
pnpm install

# List installed packages
echo ""
echo "📋 Installed packages:"
pnpm list --depth 0

# Build Storybook
echo ""
echo "🏗️  Building Storybook..."
pnpm build-storybook

echo ""
echo "✅ E2E test completed successfully!"
echo ""
echo "📂 Example project location: $EXAMPLE_DIR"
echo ""
echo "You can now:"
echo "  cd $EXAMPLE_DIR"
echo "  pnpm storybook     # Start dev server"
echo "  pnpm build-storybook  # Build again"
