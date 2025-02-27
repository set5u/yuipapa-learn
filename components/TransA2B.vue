<template>
  <div class="h6">
    {{
      (alter.transA2B || lang.transA2B)
        .replace("{A}", nativeNameInLang)
        .replace("{B}", B[4])
    }}
  </div>
</template>
<script setup lang="ts">
  const B = langList.find((v) => v[1] === selectedLang.value)!;
</script>
