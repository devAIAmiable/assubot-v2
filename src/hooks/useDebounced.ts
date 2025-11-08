import { useEffect, useState } from 'react';

export const useDebounced = <T>(value: T, ms = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), ms);
    return () => window.clearTimeout(timer);
  }, [value, ms]);

  return debouncedValue;
};
