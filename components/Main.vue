<template>
  <div class="container text-center my-4">
    <component :is></component>
  </div>
</template>
<script setup lang="ts">
  import NativeLang from "./NativeLang.vue";
  import Home from "./Home.vue";
  const is = shallowRef(native.value ? Home : NativeLang);
  provide("is", is);
</script>
