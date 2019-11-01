import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import { copy as fsCopy, remove as fsRemove } from "fs-extra";
import { prependString, propAny } from "./random";

export const copy = (dir: string, to: string): TE.TaskEither<string, void> =>
  pipe(
    TE.tryCatch(() => fsCopy(dir, to), propAny<Error>("message")),
    TE.mapLeft(prependString("[COPY DIR]"))
  );
export const remove = (dir: string): TE.TaskEither<string, void> =>
  pipe(
    TE.tryCatch(() => fsRemove(dir), propAny<Error>("message")),
    TE.mapLeft(prependString("[REMOVE DIR]"))
  );

// @todo: find a way to make the params infer correctly with multiple available implementations :/
const wrapExtraFsFunc = <T extends (...args: any[]) => Promise<any>>(
  fn: T
): ((...args: Parameters<T>) => TE.TaskEither<string, void>) => (
  ...args: Parameters<T>
) => pipe(TE.tryCatch(() => fn(...args), propAny<Error>("message")));

// const copyDir2 = ( src: string, dest: string ): TE.TaskEither<string, void> => pipe(
// 	wrapExtraFsFunc( copy ) ( src, dest ),
// 	TE.map( log( `Directory "${src}" copied to "${dest}"` ) ),
// 	TE.mapLeft( prependString( "[COPY DIR]" ) ) ,
// )
