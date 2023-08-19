<template>
  <div style="display: flex;gap: 20px;padding: 20px;">
    <NuxtLink to="/">
      <MyButton>Home</MyButton>
    </NuxtLink>
  </div>
  <div>
    <h1>News</h1>
  </div>

  <pre>
  fullPath =  {{ $route.fullPath }}
  path = {{ $route.path }}
  query {{ $route.query }}
</pre>
</template>

```
