<template>
  <div class="h1">
    {{ alter.home || lang.home }}
  </div>
  <div v-if="error">{{ alter.error || lang.error }}</div>
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
  <div class="my-4">
    <div class="my-4">
      <button class="btn btn-outline-primary" @click="is = Select">
        {{ alter.modeSelect || lang.modeSelect }}
      </button>
    </div>
  </div>
  <div>
    <div class="my-4 h4">
      {{ alter.word_list || lang.word_list }}
    </div>
    <div class="my-4">
      <button
        class="btn btn-outline-primary m-2"
        @click="addWordAbout"
        :disabled="generating"
      >
        {{ alter.add_word_about || lang.add_word_about }}
      </button>
      <input v-model="word" />
    </div>
    <WordList></WordList>
  </div>
</template>

<script setup lang="ts">
  import AddLang from "./AddLang.vue";
  import NativeLang from "./NativeLang.vue";
  import Select from "./Select.vue";
  translateIfNeeded();
  const is = inject<Ref<Component>>("is")!;
  const onNativeChange = () => {
    is.value = NativeLang;
  };
  const addLang = () => {
    is.value = AddLang;
  };
  const word = ref("");
  const generating = ref(false);
  const error = ref(false);
  const addWordAbout = async () => {
    if (!word.value.length) {
      return;
    }
    generating.value = true;
    try {
      await genBasic(
        native.value,
        nativeNameInLang.value,
        (alter.gen_about || lang.gen_about).replace("{0}", word.value)
      );
      word.value = "";
      generating.value = false;
    } catch {
      error.value = true;
    }
  };
</script>
