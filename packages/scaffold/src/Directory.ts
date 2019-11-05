import * as TE from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/pipeable"
import { copy as fsCopy, remove as fsRemove } from "fs-extra"
import { prependString, propAny } from "./random"

export const copy = (dir: string, to: string): TE.TaskEither<string, void> =>
	pipe(
		TE.tryCatch(() => fsCopy(dir, to), propAny<Error>("message")),
		TE.mapLeft(prependString("[COPY DIR]")),
	)
export const remove = (dir: string): TE.TaskEither<string, void> =>
	pipe(
		TE.tryCatch(() => fsRemove(dir), propAny<Error>("message")),
		TE.mapLeft(prependString("[REMOVE DIR]")),
	)
