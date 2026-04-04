<script setup>
import { computed } from "vue";
const props = defineProps({
  colorMode: { type: String, required: false, default: "light" },
  title: { type: String, required: false, default: "Integrate Storybook in your Nuxt app" },
  description: { type: String, required: false },
  width: { type: Number, required: false, default: 1200 },
  height: { type: Number, required: false, default: 600 }
});
const themeColor = '255, 71, 133' // #ff4785
</script>

<template>
  <div
    class="w-full h-full flex flex-col justify-center items-center relative p-10 lg:p-[60px] bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50"
  >
    <!-- Gradient background -->
    <div
      class="absolute top-0 left-0 right-0 bottom-0" :style="{
  backgroundImage: `radial-gradient(at 100% 100%, rgba(${themeColor}, 0.15), transparent)`
}"
    />
    <div
      class="absolute top-0 left-0 right-0 bottom-0" :style="{
  backgroundImage: `radial-gradient(at 0% 0%, rgba(${themeColor}, 0.1), transparent)`
}"
    />

    <div class="relative flex flex-col items-center text-center gap-5 lg:gap-8">
      <!-- Logo -->
      <Logo/>

      <div class="items-center justify-center w-full">
        <!-- Title -->
        <h1
          class="text-[48px] lg:text-[80px] font-bold m-0 leading-tight max-w-[700px] lg:max-w-[1000px]"
          style="display: block; line-clamp: 3; text-overflow: ellipsis; text-wrap: balance;"
        >
          {{ title }}
        </h1>
      </div>

      <!-- Description -->
      <p v-if="description" class="text-[24px] lg:text-[32px] opacity-70 max-w-[650px] lg:max-w-[900px] leading-relaxed">
        {{ description }}
      </p>
    </div>
  </div>
</template>
