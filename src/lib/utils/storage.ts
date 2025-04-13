import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

export const StorageKeys = {
  TOKEN: 'token',
  USER: 'user',
  SELECTED_MODULE: 'selectedModule',
} as const;

export const storage = {
    get: (key: string): string | null => {
        try {
          const value = getCookie(key);
          return typeof value === 'string' ? value : null;
        } catch {
          return null;
        }
      },

  set: (key: string, value: string): void => {
    try {
      setCookie(key, value, { maxAge: 60 * 60 * 24 * 30 }); // 30 days
    } catch (err) {
      console.error('Error setting cookie',err);
    }
  },

  remove: (key: string): void => {
    try {
      deleteCookie(key);
    } catch {
      console.error('Error removing cookie');
    }
  },

  getJson: <T = unknown>(key: string): T | null => {
    try {
      const value = getCookie(key);
      if (value) {
        const stringValue = typeof value === 'string' ? value : String(value);
        return JSON.parse(stringValue) as T;
      }
      return null;
    } catch {
      return null;
    }
  },

  setJson: <T>(key: string, value: T): void => {
    try {
      setCookie(key, JSON.stringify(value), { maxAge: 60 * 60 * 24 * 30 }); // 30 days
    } catch {
      console.error('Error setting JSON cookie');
    }
  },
};

// Custom hook for safely accessing cookies in client components
export function useCookie<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const cookieValue = storage.getJson<T>(key);
    return cookieValue !== null ? cookieValue : defaultValue;
  });

  useEffect(() => {
    const cookieValue = storage.getJson<T>(key);
    if (cookieValue !== null) {
      setValue(cookieValue);
    }
  }, [key]);

  const updateValue = (newValue: T) => {
    storage.setJson(key, newValue);
    setValue(newValue);
  };

  return [value, updateValue];
}
