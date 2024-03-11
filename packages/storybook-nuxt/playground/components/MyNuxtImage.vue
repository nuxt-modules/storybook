<template>
  <div>
    <NuxtImg
      src="/images/sb-nuxt-logo.png"
      :placeholder="[30, 20]"
      width="300"
      height="200"
      class="rounded"
    />
    <br>
    <h4>
      responsive image with nuxt-image component:
    </h4>
    <NuxtPicture
      src="/images/sb-nuxt-logo.png"
      width="1204"
      height="632"
      sizes="xs:200px md:500px lg:1024"
    />
  </div>
</template>
