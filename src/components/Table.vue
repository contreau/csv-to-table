<script setup lang="ts">
import { store } from "../store";
</script>

<template>
  <section class="component-wrapper">
    <div class="table-responsive">
      <table class="table table-hover table-striped">
        <thead>
          <th v-for="column in store.tableColumns">{{ column }}</th>
        </thead>
        <tbody>
          <tr v-for="row in store.tableRows">
            <td v-for="cell in row">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.table-responsive {
  min-height: 0.01%;
  overflow-x: auto;
}

.table {
  width: 100%;
  max-width: 100%;
  margin-bottom: 20px;
}

table {
  background-color: transparent;
  border-collapse: collapse;
}

.table-striped > tbody {
  border-top: 5px solid #aa9868;
}

.table > thead:first-child > tr:first-child > th {
  border-top: 0;
}

.table > thead > tr > th {
  line-height: 1.5;
}

.table > thead > tr > th {
  padding: 8px;
}

th {
  text-align: left;
}

.table-striped > tbody > tr > td {
  padding: 15px;
  border-top: 1px solid #ddd;
}

.table-striped > tbody > tr:nth-of-type(2n + 1) {
  background-color: #fafafa;
}

.table-hover > tbody > tr:hover {
  background-color: #f5f5f5;
}

.table-hover tbody tr {
  transition: background-color 0.4s;
}
</style>
