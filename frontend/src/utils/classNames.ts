export const classNames = (...classes: (string | string[] | undefined | null | false)[]): string => {
  return classes
    .flat()
    .filter(Boolean)
    .join(' ');
};

