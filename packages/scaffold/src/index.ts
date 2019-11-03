import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { resolve } from "path";
import { app, PackageConfig } from "./app";
import { merge } from "ramda";
import { pipe } from "fp-ts/lib/pipeable";
import { ask, Prompts } from "./ask";

const appConfig = {
  templatesRepo: "https://github.com/isthatcentered/create-templates.git",
  templatesClonePath: resolve(".", ".__templates")
};

const prompts: Prompts<PackageConfig> = {
  package_name: {
    type: "input",
    message: "Package name"
  },
  package_description: {
    type: "input",
    message: "Package description"
  },
  path: {
    type: "input",
    message: "Path",
    default: "."
  },
  template: {
    type: "list",
    message: "Template",
    // @ts-ignore
    choices: ["typescript"]
  }
};

const askForConfigAndLaunch = pipe(
  ask<PackageConfig>(prompts),
  TE.map(merge(appConfig)),
  TE.chain(app)
);

export default () =>
  askForConfigAndLaunch()
    .then(E.fold(console.error, () => console.log("Done!")))
    .catch(console.error);
