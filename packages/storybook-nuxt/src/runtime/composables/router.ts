import { useNuxtApp } from "nuxt/app";
import { useRouter as useVueRouter } from "vue-router";

export const useRouter = () => {
    const router = useNuxtApp()?.$router ?? useVueRouter() ;
   return router  ;
 };