<template>
  <div class="storybook">
    <NuxtErrorBoundary>
      <MyBomb />
      <template #error="{ error, clearError }">
        <p role="alert">caught: {{ error.message }}</p>
        <MyButton label="recover" size="small" @click="clearError" />
      </template>
    </NuxtErrorBoundary>
  </div>
</template>
