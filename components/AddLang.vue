<template>
  <div class="text-start" v-if="native">
    <button class="btn btn-outline-primary m-4" @click="is = Home">
      {{ alter.back || lang.back }}
    </button>
  </div>
  <div class="my-4 h1">
    {{ alter.add_lang || lang.add_lang }}
  </div>
  <SelectLang :onConfirm></SelectLang>
</template>
<script setup lang="ts">
  import Home from "./Home.vue";

  const is = inject<Ref<Component>>("is")!;
  const onConfirm = async (
    val: {
      language_code: string;
      language_name: string;
      language_name_in_the_language: string;
      language_code_including_country_code: string;
    },
    n: string
  ) => {
    langList.push([
      val.language_code,
      val.language_code_including_country_code,
      val.language_name,
      val.language_name_in_the_language,
      n,
    ]);
    is.value = Home;
  };
</script>
