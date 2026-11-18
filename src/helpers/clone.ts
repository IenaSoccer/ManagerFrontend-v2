import { toRaw } from 'vue';

/** Clone JSON-like application data after removing Vue's reactive proxy. */
export const cloneReactiveData = <T extends object>(value: T): T => {
  return structuredClone(toRaw(value));
};
