<template>
  <div v-if="error">{{ alter.error || lang.error }}</div>
  <div v-if="generating">
    {{ alter.generating || lang.generating }}
  </div>
  <div>
    {{ selectedLang }}
    {{ wordList }}
  </div>
</template>

<script setup lang="ts">
  const generating = ref(false);
  const error = ref(false);
  if (!wordList.length) {
    generating.value = true;
    (async () => {
      try {
        await genBasic(native.value, nativeNameInLang.value);
      } catch {
        error.value = true;
      } finally {
        generating.value = false;
      }
    })();
  }
</script>
