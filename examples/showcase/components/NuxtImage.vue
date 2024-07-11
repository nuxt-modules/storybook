<template>
  <div>
    <NuxtImg
      src="/images/sb-nuxt-logo.jpg"
      :placeholder="[30, 20]"
      width="300"
      height="200"
      class="rounded"
    />
    <br />
    <h4>Responsive image with nuxt-image component:</h4>
    <NuxtPicture
      src="/images/sb-nuxt-logo.jpg"
      width="1204"
      height="632"
      sizes="xs:200px md:500px lg:1024"
    />
  </div>
</template>
