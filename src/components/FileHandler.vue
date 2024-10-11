<script setup lang="ts">
import { ref } from "vue";
import { store } from "../store";
const csvParseError = ref(false);
const errorAttributes = ref({
  rowIndex: 0,
  rowContent: "",
  expectedCols: 0,
  actualCols: 0,
});

function readFile(event: Event): Promise<string> {
  return new Promise((resolve, reject) => {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    const fileList = input.files;
    if (fileList === null) {
      reject("File list empty.");
    } else {
      const csv = fileList[0];
      // file reader config
      const reader = new FileReader();
      reader.onloadend = (event: ProgressEvent<FileReader>) => {
        if (event.target !== null) {
          resolve(event.target.result as string);
        }
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsText(csv);
    }
  });
}

async function handleFile(event: Event) {
  try {
    const result = await readFile(event);
    const rows = result.split("\n");

    // * trims whitespace + removes any commas at the end
    for (let i = 0; i < rows.length; i++) {
      rows[i] = rows[i].trim();
      if (rows[i][rows[i].length - 1] === ",") {
        rows[i] = rows[i].slice(0, rows[i].length - 1);
      }
    }
    // * throws an error if a row has more column entries than the first
    const firstRow: string = rows[0];
    let totalColumnCount: number = 1;
    for (let char of firstRow) {
      if (char === ",") totalColumnCount++;
    }
    // TODO: handle blank cells (double commas ,, or "") by replacing with ""
    for (let i = 0; i < rows.length; i++) {
      let instanceColumnCount = 1;
      for (let j = 0; j < rows[i].length; j++) {
        if (rows[i][j] === ",") instanceColumnCount++;
      }
      if (instanceColumnCount > totalColumnCount) {
        const err = `File has at least one row with more entries than the designated columns.\nExpected columns: ${totalColumnCount}\nActual columns: ${instanceColumnCount}\nEncountered at Row ${i}: ${rows[i]}`;
        errorAttributes.value.rowIndex = i;
        errorAttributes.value.rowContent = rows[i];
        errorAttributes.value.expectedCols = totalColumnCount;
        errorAttributes.value.actualCols = instanceColumnCount;
        csvParseError.value = true;
        throw new Error(err);
      }
    }

    // save table columns
    store.tableColumns = rows[0].split(",");
    const tableRows: Record<string, Array<string>> = {};
    for (let i = 1; i < rows.length; i++) {
      const arr = rows[i].split(",");
      tableRows[`${i}`] = arr;
    }
    store.tableRows = tableRows;
    store.showTable = true;
    console.log(store.tableRows);
  } catch (error) {
    console.error(error);
  }
}

function resetFileUpload() {
  // @ts-ignore
  const fileInput: HTMLInputElement =
    document.querySelector('input[type="file"]');
  fileInput.value = "";
  csvParseError.value = false;
}
</script>

<template>
  <div class="file-upload-container">
    <label for="csvUpload">Upload CSV:</label>
    <input
      @change="handleFile($event)"
      @click="resetFileUpload"
      id="csvUpload"
      name="csvUpload"
      type="file"
      accept=".csv"
    />
  </div>
  <div v-if="csvParseError" class="error-block">
    <p class="error-description">
      <span
        >Error: File has at least one row with more entries than the designated
        columns.</span
      >
    </p>
    <hr />
    <p><b>Expected Columns:</b> {{ errorAttributes.expectedCols }}</p>
    <p><b>Actual Columns:</b> {{ errorAttributes.actualCols }}</p>
    <p>
      <b>Encountered at Row {{ errorAttributes.rowIndex }}:</b>
      {{ errorAttributes.rowContent }}
    </p>
  </div>
</template>

<style scoped>
.file-upload-container {
  display: flex;
  gap: 1rem;
  align-items: center;
  :is(label) {
    font-weight: 600;
  }
}

input,
label {
  font-size: 1.2rem;
}

div.error-block {
  background-color: #f1f1f1;
  border-radius: 10px;
  max-width: fit-content;
  padding: 0.1em 1em;
  margin: 1rem auto;
  font-size: 1.1rem;
}

p.error-description {
  font-size: 1.25rem;
  font-weight: 600;
  :is(span) {
    color: #ff3636;
  }
}
</style>
