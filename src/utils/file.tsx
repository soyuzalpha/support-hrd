export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };

    reader.onerror = (error) => reject(error);
  });
};

export const normalizeFile = (input: File | File[] | FileList | null | undefined): File | null => {
  if (!input) return null;
  if (input instanceof File) return input;
  if (Array.isArray(input)) return input[0] || null;
  if (input instanceof FileList) return input[0] || null;
  return null;
};
