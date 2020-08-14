<template>
  <div>
    <h2>Fetch Test</h2>
    <ul>
      <li v-for="post of posts" :key="post.id">
        <nuxt-link :to="`/posts/${post.id}`">{{ post.title }}</nuxt-link>
      </li>
    </ul>

    <button @click="$fetch">Refetch</button>
  </div>
</template>

<script>
export default {
  async fetch() {
    console.log("fetching...");
    this.posts = await this.$axios.$get(
      "https://jsonplaceholder.typicode.com/posts"
    );
  },
  data() {
    return {
      posts: []
    };
  }
};
</script>
