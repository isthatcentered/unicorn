import { curry } from "ramda";
import handlebars from "handlebars";

export const prependString = (prepend: string) => (str: string) =>
  prepend.concat(" ", str);
export const propAny = <T>(key: keyof T) => (e: any) => e[key];
const stripExtension = curry((extension: string, name: string) =>
  name.replace(new RegExp(extension, "i"), "")
);
export const stripHbsExtension = stripExtension(".hbs");
export const renderTemplate = curry(
  <T extends Record<string, any>>(data: T, contents: string) =>
    handlebars.compile(contents)(data)
);
export const pass = () => undefined;
export const log = (tag: string) => <T>(data: T) => {
  console.log(tag, data);

  return data;
};
export const type = <T>() => (thing: any) => thing as T;
