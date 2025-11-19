"use client";

import { useCallback, useState } from "react";

export type UseDialogModalReturn<T = undefined> = {
  open: boolean;
  data: T | null;
  handleOpen: (data?: T) => void;
  handleClose: () => void;
};

export function useDialogModal<T = undefined>(): UseDialogModalReturn<T> {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const handleOpen = useCallback((data?: T) => {
    if (data !== undefined) {
      setData(data);
    }
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setData(null);
  }, []);

  return {
    open,
    data,
    handleOpen,
    handleClose,
  };
}
