import * as TE from "fp-ts/lib/TaskEither"
import { ErrorReport } from "../index"
import { pipe } from "fp-ts/lib/pipeable"
import exec from "../exec"
import { always } from "ramda"

const cloneGithubRepo: (config: {
	destination: string
	repositoryUrl: string
}) => TE.TaskEither<ErrorReport, void> = config =>
	pipe(
		exec("git", ["clone", config.repositoryUrl, config.destination]),
		TE.map(always(undefined)),
	)
export default cloneGithubRepo
