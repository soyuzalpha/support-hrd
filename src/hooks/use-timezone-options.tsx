import rawTimezones from "@/data/timezone.json";

type TimezoneOption = {
  label: string;
  value: string;
};

/**
 * Load timezone options async style
 * @param inputValue string from search
 * @returns top 10 matching timezone options
 */
export async function loadTimezoneOptions(inputValue: string = ""): Promise<TimezoneOption[]> {
  const search = inputValue.toLowerCase();

  // Simulasi delay fetch async (opsional)
  await new Promise((resolve) => setTimeout(resolve, 200));

  const filtered = rawTimezones.filter((tz) => tz.label.toLowerCase().includes(search));
  return filtered.slice(0, 10); // tampilkan max 10 hasil
}
