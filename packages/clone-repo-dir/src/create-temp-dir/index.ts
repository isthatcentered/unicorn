import * as TE from "fp-ts/lib/TaskEither"
import { ErrorReport } from "../index"
import { pipe } from "fp-ts/lib/pipeable"
import * as tempy from "tempy"

const createTempDir: TE.TaskEither<ErrorReport, string> = pipe(
	tempy.directory(),
	TE.right,
)

export default createTempDir
