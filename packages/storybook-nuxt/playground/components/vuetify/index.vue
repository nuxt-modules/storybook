<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
defineProps({
  message: String,
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-sheet
          class="pa-4 d-flex align-center flex-column"
          color="grey-lighten-3"
          rounded="lg"
        >
          <div>
            <v-icon color="orange" icon="mdi-fire" />
            @invictus.codes/nuxt-vuetify by
            <a href="https://invictus.codes">
              invictus.codes &nbsp;<v-icon icon="mdi-home" size="12" />
            </a>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-sheet class="pa-4 d-flex align-center flex-column">
          Storybook <v-icon color="pink" icon="mdi-heart" /> Nuxt
        </v-sheet>
      </v-col>
      <v-col>
        <v-sheet class="pa-4 d-flex justify-space-between flex-row">
          Storybook <v-icon color="pink" icon="mdi-heart" /> Nuxt
        </v-sheet>
      </v-col>
      <v-col>
        <v-sheet class="pa-4 d-flex align-center flex-column">
          Storybook <v-icon color="pink" icon="mdi-heart" /> Nuxt
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
