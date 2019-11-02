import * as TE from "fp-ts/lib/TaskEither";
import fnd from "find";
import { compose, curry } from "ramda";
import { pass, prependString, propAny } from "./random";
import { readFile, rename as fsRename, writeFile } from "fs-extra";
import { pipe } from "fp-ts/lib/pipeable";

export const find = (
  pattern: RegExp,
  path: string
): TE.TaskEither<string, string[]> =>
  TE.tryCatch(
    () => new Promise((res, rej) => fnd.file(pattern, path, res).error(rej)),
    compose(
      prependString("[FIND FILES]"),
      propAny<Error>("message")
    )
  );

export const read = (file: string) =>
  TE.tryCatch(
    () => readFile(file, "utf-8"),
    compose(
      prependString("[READ FILE]"),
      propAny<Error>("message")
    )
  );

export const write = curry((file: string, contents: string) =>
  TE.tryCatch(
    () => writeFile(file, contents, { encoding: "utf-8" }),
    compose(
      prependString("[WRITE FILE]"),
      propAny<Error>("message")
    )
  )
);

export const rename = curry((previousName: string, newName: string) =>
  TE.tryCatch(
    () => fsRename(previousName, newName),
    compose(
      prependString("[RENAME FILE]"),
      propAny<Error>("message")
    )
  )
);

export const overwrite = curry(
  (
    map: (contents: string) => string,
    file: string
  ): TE.TaskEither<string, void> =>
    pipe(
      read(file),
      TE.map(map),
      TE.chain(write(file)),
      TE.map(pass)
    )
);
