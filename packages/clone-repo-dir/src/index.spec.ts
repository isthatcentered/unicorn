import cloneRepoDir from "./index"
import * as assert from "./assert"
import { when } from "./assert"
import * as TE from "fp-ts/lib/TaskEither"
import * as EI from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/pipeable"
import * as path from "path"
import copy from "./copy-dir"
import createTempDir from "./create-temp-dir"
import cloneGithubRepo from "./clone-github-repo"

jest.mock("./create-temp-dir")
jest.mock("./clone-github-repo")
jest.mock("./copy-dir")

test(`Successful clone returns a right`, async () => {
	const destination = "path_to_destination",
		tempDirPath = "temp_folder_path",
		config = {
			directoryPath: "repo_directory_path",
			repository: "repository_url",
		},
		cloneMyRepo = cloneRepoDir(config)

	when(createTempDir)
		.calledWith()
		.mockResolvedValue(EI.right(tempDirPath))

	when(cloneGithubRepo)
		.calledWith({
			destination: tempDirPath,
			repositoryUrl: config.repository,
		})
		.mockReturnValue(TE.right(undefined))

	when(copy)
		.calledWith({
			src: path.join(tempDirPath, config.directoryPath),
			destination,
		})
		.mockReturnValue(TE.right(undefined))

	await pipe(
		cloneMyRepo(destination),
		assert.onTaskRight(assert.is(destination)),
	)
})
