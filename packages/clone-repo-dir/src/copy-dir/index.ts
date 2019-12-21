import * as TE from "fp-ts/lib/TaskEither"
import { ErrorReport } from "../index"
import { copy as fsCopy } from "fs-extra"
import { flow } from "fp-ts/lib/function"

const copy: (config: {
	src: string
	destination: string
}) => TE.TaskEither<ErrorReport, void> = config =>
	TE.tryCatch(
		() => fsCopy(config.src, config.destination),
		flow(
			err => err as Error,
			err => ({
				message: err.message,
				context: "copy",
				originalError: err,
			}),
		),
	)

export default copy
