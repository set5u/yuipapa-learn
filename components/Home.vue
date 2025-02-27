<template>
  <div class="my-4 h1">
    {{ alter.home || lang.home }}
  </div>
  <div class="my-4">
    {{
      alter.your_native?.replace("{}", `${nativeNameInLang}`) ||
      lang.your_native.replace("{}", `${nativeNameInLang}`)
    }}
    <button class="btn btn-outline-primary mx-2" @click="onNativeChange">
      {{ alter.change || lang.change }}
    </button>
  </div>
  <div class="my-4">
    <div class="my-4 h4">
      {{ alter.lang_list || lang.lang_list }}
    </div>
    <LangList></LangList>
    <div class="my-4">
      <button class="btn btn-outline-primary" @click="addLang">
        {{ alter.add_button || lang.add_button }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AddLang from "./AddLang.vue";
  import NativeLang from "./NativeLang.vue";

  const is = inject<Ref<Component>>("is")!;
  const onNativeChange = () => {
    is.value = NativeLang;
  };
  const addLang = () => {
    is.value = AddLang;
  };
</script>
