/**
 * Utility function to conditionally join classNames
 * Similar to the popular 'clsx' library but lightweight
 */
export const classNames = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

