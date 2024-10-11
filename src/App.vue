<script setup lang="ts">
import { store } from "./store";
import Table from "./components/Table.vue";
import FileHandler from "./components/FileHandler.vue";
</script>

<template>
  <main>
    <header>
      <h1>CSV to Table Demo</h1>
    </header>
    <FileHandler />
    <Table v-if="store.showTable" />
  </main>
</template>

<style>
header {
  margin-bottom: 3rem;
}
main {
  padding: 0 1.5em;
}

.component-wrapper {
  padding: 2em 0;
}
</style>
