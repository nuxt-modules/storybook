<template>
    <div>
        <nuxt-content :document="document" />
    </div>
</template>

<script>
export default {
    async fetch () {
        this.document = await this.$content('test').fetch()
    },
    data () {
        return {
            document: null
        }
    }
}
</script>