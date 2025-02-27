<template>
  <div class="text-start" v-if="native">
    <button class="btn btn-outline-primary m-4" @click="is = Home">
      {{ alter.back || lang.back }}
    </button>
  </div>
  <div class="h6">
    {{
      (alter.transA2B || lang.transA2B)
        .replace("{A}", nativeNameInLang)
        .replace("{B}", B[4])
    }}
  </div>
</template>
<script setup lang="ts">
  import Home from "./Home.vue";
  const is = inject<Ref<Component>>("is")!;
  const B = langList.find((v) => v[1] === selectedLang.value)!;
</script>
