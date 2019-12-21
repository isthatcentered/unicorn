import * as TE from "fp-ts/lib/TaskEither"
import { ErrorReport } from "../index"
import execa from "execa"
import { flow } from "fp-ts/lib/function"

const exec: (
	command: string,
	args: string[],
) => TE.TaskEither<ErrorReport, execa.ExecaReturnValue> = (command, args) =>
	TE.tryCatch(
		() => execa(command, args),
		flow(
			err => err as execa.ExecaError,
			err => ({
				context: "execEither",
				message: err.shortMessage,
				originalError: err,
			}),
		),
	)
export default exec
