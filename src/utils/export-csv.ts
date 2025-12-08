import Papa from "papaparse";

export function exportToCSV(filename: string, data: any[]) {
  if (!data || data.length === 0) {
    console.warn("No data to export.");
    return;
  }

  // Flatten nested object (karena data lu banyak nested)
  const flatten = (obj: any, parentKey = "") => {
    return Object.keys(obj).reduce((acc: any, key) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(acc, flatten(obj[key], newKey));
      } else {
        acc[newKey] = obj[key];
      }

      return acc;
    }, {});
  };

  const flattenedData = data.map((item) => flatten(item));

  const csv = Papa.unparse(flattenedData);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
}
