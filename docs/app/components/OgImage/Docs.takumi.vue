<script setup>
defineProps({
  colorMode: { type: String, required: false, default: "dark" },
  title: { type: String, required: false, default: "Documentation" },
  description: { type: String, required: false, default: "Documentation for the Nuxt-Storybook module" },
  icon: { type: String, required: false },
  primaryColor: { type: String, required: false, default: "rgba(255, 71, 133, 1)" },
  primaryTextColor: { type: String, required: false, default: "hsl(354, 90%, 60%)" },
});
</script>

<template>
  <div
    class="w-full h-full relative flex flex-col overflow-hidden bg-white text-neutral-900 dark:bg-neutral-950 dark:text-white"
  >
    <div
      class="absolute top-0 left-0 right-0 bottom-0" :style="{
  backgroundImage: `radial-gradient(at 100% 100%, rgba(255, 71, 133, 0.15), transparent)`
}"
    />
    <div class="flex flex-col w-full h-full p-[60px] relative justify-between">
      <div class="flex flex-col gap-8 mb-10" style="text-wrap: pretty;">
        <span
          class="text-[72px] font-extrabold"
          style="line-height: 1.1; letter-spacing: -0.04em;"
        >
          {{ title }}
        </span>
        <span
          class="text-[44px] font-normal text-neutral-500 dark:text-neutral-400"
          style="line-height: 1.4; max-width: 95%; letter-spacing: -0.01em; line-clamp: 2; text-overflow: ellipsis; overflow: hidden;"
        >
          {{ description }}
        </span>
      </div>

      <div class="flex items-center gap-7">
        <img
          v-if="icon"
          :src="icon"
          alt="Icon"
          class="w-16 h-16"
          style="object-fit: contain;"
        >
        <Logo/>
        <div style="flex-grow: 1;" />
        <div
          :style="{
  height: '4px',
  width: '60px',
  backgroundColor: primaryColor,
  borderRadius: '2px'
}"
        />
        <span
          class="text-[22px] font-bold uppercase"
          :style="{
  letterSpacing: '0.2em',
  color: primaryTextColor,
  opacity: 0.8
}"
        >
          Documentation
        </span>
      </div>
    </div>
  </div>
</template>
