"use client";
import { useState } from "react";

interface FormSubmitCallback<T> {
  (value: T): Promise<void>;
}

export const useFormSubmit = <T extends Record<string, unknown>>(
  onSubmitCallback: FormSubmitCallback<T>,
) => {
  const [processing, setProcessing] = useState<boolean>(false);

  const onSubmit = async (value?: T): Promise<void> => {
    setProcessing(true);
    try {
      await onSubmitCallback(value as T);
    } catch (error) {
      console.error("Error while submitting form", error);
    } finally {
      setProcessing(false);
    }
  };
  return { onSubmit, processing };
};
