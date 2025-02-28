<template>
  <div class="text-start">
    <button class="btn btn-outline-primary m-4" @click="is = Home">
      {{ alter.back || lang.back }}
    </button>
    <br />
    <input type="checkbox" id="A2B" value="A2B" v-model="modes" class="m-4" />
    <label for="A2B">{{ alter.A2BTranslation || lang.A2BTranslation }}</label>
    <br />
    <input type="checkbox" id="B2A" value="B2A" v-model="modes" class="m-4" />
    <label for="B2A">{{ alter.B2ATranslation || lang.B2ATranslation }}</label>
    <br />
    <input
      type="checkbox"
      id="ReadSumm"
      value="ReadSumm"
      v-model="modes"
      class="m-4"
    />
    <label for="ReadSumm">{{
      alter.readingSummarize || lang.readingSummarize
    }}</label>
    <br />
    <input
      type="checkbox"
      id="Listening"
      value="Listening"
      v-model="modes"
      class="m-4"
    />
    <label for="B2A">{{ alter.listening || lang.listening }}</label>
    <br />
  </div>
</template>

<script lang="ts">
  export const modes = ref<string[]>(
    JSON.parse(localStorage.getItem("modes") || "['A2B']")
  );
  watch(modes, () => {
    if (!modes.value.length) {
      modes.value.push("A2B");
      return;
    }
    localStorage.setItem("modes", JSON.stringify(modes.value));
  });
</script>

<script setup lang="ts">
  import Home from "./Home.vue";

  const is = inject<Ref<Component>>("is")!;
</script>
