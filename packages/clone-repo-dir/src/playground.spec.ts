import { pipe } from "fp-ts/lib/pipeable"
import * as TE from "fp-ts/lib/TaskEither"
import cloneRepoDir from "./index"

xtest(`blah`, async () => {
	const res = await pipe(
		cloneRepoDir({
			directoryPath: "typescript",
			repository: "https://github.com/isthatcentered/create-templates",
		})("./blah"),
		TE.bimap(console.error, console.log),
	)()
})
