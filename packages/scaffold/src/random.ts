import { curry, map } from "ramda";
import handlebars from "handlebars";
import * as TE from "fp-ts/lib/TaskEither";
import { flow } from "fp-ts/lib/function";
import { array } from "fp-ts/lib/Array";

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
const mergeTE = array.sequence(TE.taskEitherSeq);
export const todoList = <A, E, B>(
  ma: (item: A) => TE.TaskEither<E, B>
): ((items: A[]) => TE.TaskEither<E, B[]>) =>
  flow(
    map(ma),
    mergeTE
  );
