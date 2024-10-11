import { reactive } from "vue";
export const store = reactive({
  showTable: <boolean>false,
  tableColumns: <Array<string>>[],
  tableRows: <Record<string, Array<string>>>{},
});
