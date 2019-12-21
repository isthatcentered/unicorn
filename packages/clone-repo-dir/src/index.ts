import * as TE from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/pipeable"
import { always } from "ramda"
import { join } from "path"
import copy from "./copy-dir"
import createTempDir from "./create-temp-dir"
import cloneGithubRepo from "./clone-github-repo"

export type ErrorReport = {
	context: string
	message: string
	originalError: Error
}

const downloadAndCopyRepoFolder: (config: {
	destination: string
	repository: string
	folderPath: string
}) => (
	tempFolder: string,
) => TE.TaskEither<ErrorReport, void> = config => tempFolder =>
	pipe(
		cloneGithubRepo({
			destination: tempFolder,
			repositoryUrl: config.repository,
		}),
		TE.chain(() =>
			copy({
				src: join(tempFolder, config.folderPath),
				destination: config.destination,
			}),
		),
	)

const cloneRepoDir: (config: {
	directoryPath: string
	repository: string
}) => (
	destination: string,
) => TE.TaskEither<ErrorReport, string> = config => destination =>
	pipe(
		createTempDir,
		TE.chain(
			downloadAndCopyRepoFolder({
				destination,
				folderPath: config.directoryPath,
				repository: config.repository,
			}),
		),
		TE.map(always(destination)),
	)

export default cloneRepoDir
