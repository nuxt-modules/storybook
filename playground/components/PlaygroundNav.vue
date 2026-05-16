<template>
  <nav class="playground-nav">
    <NuxtLink to="/" class="nav-link" exact-active-class="is-active">
      Home
    </NuxtLink>
    <NuxtLink to="/docs" class="nav-link" active-class="is-active">
      Docs
    </NuxtLink>
    <NuxtLink to="/examples" class="nav-link" active-class="is-active">
      Examples
    </NuxtLink>
    <NuxtLink to="/contact" class="nav-link" active-class="is-active">
      Contact
    </NuxtLink>
  </nav>
</template>

<style scoped>
.playground-nav {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.nav-link {
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  padding: 0.4rem 0.8rem;
  text-decoration: none;
  color: #1f2937;
  background: #ffffff;
  transition: all 0.2s ease;
}

.nav-link:hover {
  border-color: #9ca3af;
  transform: translateY(-1px);
}

.nav-link.is-active {
  border-color: #2563eb;
  background: #2563eb;
  color: #ffffff;
}
</style>
