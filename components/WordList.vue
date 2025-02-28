<template>
  <table class="table">
    <thead>
      <tr>
        <td>
          <button class="btn btn-outline-primary" @click="page > 0 && page--">
            {{ alter.prev_page || lang.prev_page }}
          </button>
        </td>
        <td>
          <button
            class="btn btn-outline-primary"
            @click="page < wordList.length / 20 - 1 && page++"
          >
            {{ alter.next_page || lang.next_page }}
          </button>
        </td>
      </tr>
    </thead>
    <tbody>
      <tr
        v-if="langList.length"
        v-for="(l, i) in wordList.slice(0 + page * 20, 20 + page * 20)"
      >
        <td>
          {{ l[0] }}
        </td>
        <td>
          <button
            class="mx-2 btn btn-outline-danger"
            @click="wordList.splice(i, 1)"
          >
            {{ alter.delete || lang.delete }}
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
  const page = ref(0);
</script>
