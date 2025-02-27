<template>
  <div v-if="error">{{ alter.error || lang.error }}</div>
  <div v-if="generating" class="h1">
    {{ alter.generating || lang.generating }}
  </div>
</template>

<script setup lang="ts">
  import TransA2B from "./TransA2B.vue";

  const generating = ref(false);
  const error = ref(false);
  const is = inject<Ref<Component>>("is")!;
  const start = () => {
    wordList.sort(
      (a, b) =>
        (a[2][selectedLang.value]?.[1] || 0) -
        (b[2][selectedLang.value]?.[1] || 0)
    );
    const idx = (Math.random() * 1) | 0;
    is.value = [TransA2B][idx];
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
