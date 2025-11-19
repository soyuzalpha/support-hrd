"use client";

import { useEffect, useState } from "react";
import { type ColorSchema, colorSchemaList, colorSchemas, getSchemasByCategory } from "@/lib/color-schemas";

const STORAGE_KEY = "color-schema";

export function useColorSchema() {
  const [schema, setSchemaState] = useState<ColorSchema>("light");
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ColorSchema | null;
    if (stored && colorSchemaList.includes(stored)) {
      setSchemaState(stored);
      applySchema(stored);
    } else {
      applySchema("light"); // Default to light if no schema is stored
    }
    setMounted(true);
  }, []);

  const setSchema = (newSchema: ColorSchema) => {
    setSchemaState(newSchema);
    localStorage.setItem(STORAGE_KEY, newSchema);
    applySchema(newSchema);
  };

  // Function to get the current schema
  const getCurrentSchema = (): ColorSchema => schema;

  // Function to get the available color schemas list
  const getColorSchemaList = (): ColorSchema[] => colorSchemaList;

  // Function to get the colors for the current color schema
  const getColorSchemaColors = () => colorSchemas[schema].colors;

  // Function to get color schemas grouped by category
  const getGroupedSchemasByCategory = () => getSchemasByCategory();

  return {
    schema,
    setSchema,
    mounted,
    getCurrentSchema,
    getColorSchemaList,
    getColorSchemaColors,
    getGroupedSchemasByCategory,
  };
}

function applySchema(schema: ColorSchema) {
  const root = document.documentElement;

  // Remove all schema classes
  colorSchemaList.forEach((s) => {
    root.classList.remove(`schema-${s}`);
  });

  // Add the new schema class
  root.classList.add(`schema-${schema}`);
}

// "use client";

// import { useEffect, useState } from "react";
// import { type ColorSchema, colorSchemaList } from "@/lib/color-schemas";

// const STORAGE_KEY = "color-schema";

// export function useColorSchema() {
//   const [schema, setSchemaState] = useState<ColorSchema>("light");
//   const [mounted, setMounted] = useState(false);

//   // Initialize from localStorage on mount
//   useEffect(() => {
//     const stored = localStorage.getItem(STORAGE_KEY) as ColorSchema | null;
//     if (stored && colorSchemaList.includes(stored)) {
//       setSchemaState(stored);
//       applySchema(stored);
//     } else {
//       applySchema("light");
//     }
//     setMounted(true);
//   }, []);

//   const setSchema = (newSchema: ColorSchema) => {
//     setSchemaState(newSchema);
//     localStorage.setItem(STORAGE_KEY, newSchema);
//     applySchema(newSchema);
//   };

//   return { schema, setSchema, mounted };
// }

// function applySchema(schema: ColorSchema) {
//   const root = document.documentElement;

//   // Remove all schema classes
//   colorSchemaList.forEach((s) => {
//     root.classList.remove(`schema-${s}`);
//   });

//   // Add the new schema class
//   root.classList.add(`schema-${schema}`);
// }
