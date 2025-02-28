<template>
  <div v-if="error">{{ alter.error || lang.error }}</div>
  <div v-if="generating" class="h1">
    {{ alter.generating || lang.generating }}
  </div>
</template>

<script setup lang="ts">
  import { modes } from "./Select.vue";
import Story from "./Story.vue";
  import TransA2B from "./TransA2B.vue";
  import TransB2A from "./TransB2A.vue";

  const generating = ref(false);
  const error = ref(false);
  const is = inject<Ref<Component>>("is")!;
  const start = () => {
    wordList.sort(
      (a, b) =>
        (a[2][selectedLang.value]?.[1] || 0) -
        (b[2][selectedLang.value]?.[1] || 0)
    );
    const modeL: Record<string, Component> = { A2B: TransA2B, B2A:TransB2A,ReadSumm:Story}
    const idx = (Math.random() * modes.value.length) | 0;
    is.value = modes.value.map(v=>modeL[v])[idx];
  };
  if (!wordList.length) {
    generating.value = true;
    (async () => {
      try {
        await genBasic(native.value, nativeNameInLang.value);
        start();
      } catch {
        error.value = true;
      } finally {
        generating.value = false;
      }
    })();
  } else {
    start();
  }
</script>
