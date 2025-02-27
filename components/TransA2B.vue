<template>
  <div class="text-start" v-if="native">
    <button class="btn btn-outline-primary m-4" @click="is = Home">
      {{ alter.back || lang.back }}
    </button>
  </div>
  <div v-if="error">{{ alter.error || lang.error }}</div>
  <div class="h1">
    {{
      (alter.transA2B || lang.transA2B)
        .replace("{A}", nativeNameInLang)
        .replace("{B}", B[4])
    }}
  </div>
  <div class="h3">
    {{
      generating
        ? alter.generatingSentence || lang.generatingSentence
        : sentence
    }}
  </div>
  <input class="form-control" v-model="user" :disabled @keyup.enter="onClick" />
  <button class="btn btn-outline-primary m-4" :onClick :disabled>
    {{ alter.confirm || lang.confirm }}
  </button>
  <div v-if="disabled">
    <div class="h3">{{ alter.answer || lang.answer }} {{ answer }}</div>
    <div class="h3" v-if="considering">
      {{ alter.considering || lang.considering }}
    </div>
  </div>
</template>
<script setup lang="ts">
  import Home from "./Home.vue";
  const is = inject<Ref<Component>>("is")!;
  const B = langList.find((v) => v[1] === selectedLang.value)!;
  const generating = ref(true);
  const error = ref(false);
  const sentence = ref("");
  const answer = ref("");
  const user = ref("");
  const considering = ref(false);
  onMounted(async () => {
    try {
      sentence.value = await createSentence(
        wordList.slice(0, 3).map((v) => v[0])
      );
      generating.value = false;
      answer.value = await translateSentence(
        sentence.value,
        nativeNameInLang.value,
        B[4]
      );
    } catch {
      error.value = true;
    }
  });
  const onClick = () => {
    disabled.value = true;
    considering.value = true;
  };
  const disabled = ref(false);
</script>
