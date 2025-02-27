<template>
  <div v-if="langList.length" v-for="(l, i) in langList" class="m-4">
    {{ l[3] }}/{{ l[4]
    }}<button class="mx-2 btn btn-outline-primary" @click="select(i)">
      {{ alter.learn || lang.learn }}
    </button>
    <button class="mx-2 btn btn-outline-danger" @click="langList.splice(i, 1)">
      {{ alter.delete || lang.delete }}
    </button>
  </div>
  <div v-else>{{ alter.add_button_below || lang.add_button_below }}</div>
</template>

<script setup lang="ts">
  import Learn from "./Learn.vue";

  const is = inject<Ref<Component>>("is")!;
  const select = (i: number) => {
    selectedLang.value = langList[i][1];
    is.value = Learn;
  };
</script>
