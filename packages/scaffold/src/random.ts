export const prependString = (prepend: string) => (str: string) =>
  prepend.concat(" ", str);
export const propAny = <T>(key: keyof T) => (e: any) => e[key];
