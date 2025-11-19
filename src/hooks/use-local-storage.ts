"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";

type StorageType = "localStorage" | "sessionStorage";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  storageType: StorageType = "localStorage"
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const storage = typeof window !== "undefined" ? window[storageType] : null;

  const readValue = (): T => {
    if (!storage) return initialValue;
    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading ${key} from ${storageType}:`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  useEffect(() => {
    if (!storage) return;
    try {
      storage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting ${key} in ${storageType}:`, error);
    }
  }, [key, storedValue, storage]);

  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (storage) {
        storage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting ${key} in ${storageType}:`, error);
    }
  };

  const clearValue = () => {
    try {
      if (storage) {
        storage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing ${key} from ${storageType}:`, error);
    }
  };

  return [storedValue, setValue, clearValue];
}
