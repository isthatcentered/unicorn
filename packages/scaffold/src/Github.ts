import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import execa, { ExecaReturnBase } from "execa";
import { pass, prependString, propAny } from "./random";

export const cloneRepo = (
  repo: string,
  path: string
): TE.TaskEither<string, void> =>
  pipe(
    TE.tryCatch(
      () => execa("git", ["clone", repo, path]).then(pass),
      propAny<ExecaReturnBase<any>>("stderr")
    ),
    TE.mapLeft(prependString("[GIT CLONE]"))
  );
