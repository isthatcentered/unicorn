import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import * as Dir from "./Directory";
import { renderTemplate, stripHbsExtension } from "./random";
import * as File from "./File";
import { always, curry, map } from "ramda";
import { array } from "fp-ts/lib/Array";
import { cloneRepo } from "./Github";
import { ask, Prompts } from "./ask";
import * as R from "fp-ts/lib/ReaderTaskEither";
import { join, resolve } from "path";

const templatesClonePath = resolve(".", ".__templates");

const template = "typescript",
  path = "./",
  data = {
    package_name: "hello",
    package_description: Math.random().toString()
  };

const importTemplates: TE.TaskEither<string, void> = pipe(
  cloneRepo(
    "https://github.com/isthatcentered/create-templates.git",
    templatesClonePath
  ),
  TE.chain(() => Dir.copy(templatesClonePath + "/" + template, path)),
  TE.chain(() => Dir.remove(templatesClonePath))
);

const findTemplateFiles: TE.TaskEither<string, string[]> = File.find(
  /.hbs/i,
  path
);

const renderFile = curry(
  (
    data: Record<string, any>,
    file: string
  ): TE.TaskEither<string, typeof file> =>
    pipe(
      File.overwrite(renderTemplate(data), file),
      TE.map(always(file))
    )
);

const stripHbsExtensionFromFilename = (
  file: string
): TE.TaskEither<string, typeof file> =>
  pipe(
    File.rename(file, stripHbsExtension(file)),
    TE.map(always(stripHbsExtension(file)))
  );

const promoteTemplateFile = curry(
  (
    data: Record<string, any>,
    file: string
  ): TE.TaskEither<string, typeof file> =>
    pipe(
      renderFile(data, file),
      TE.chain(stripHbsExtensionFromFilename)
    )
);

const promoteTemplateFiles = curry(
  (
    data: Record<string, any>,
    files: string[]
  ): TE.TaskEither<string, typeof files> =>
    pipe(
      map(promoteTemplateFile(data))(files),
      array.sequence(TE.taskEither)
    )
);

type TemplateConfig = {
  package_name: string;
  package_description: string;
  path: string;
  template: string;
};

const questions: Prompts<TemplateConfig> = {
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

type Config = {
  templatesRepo: string;
  templatesClonePath: string;
};

const cloneTemplatesRepo = (): R.ReaderTaskEither<Config, string, void> => ({
  templatesRepo,
  templatesClonePath
}) => cloneRepo(templatesRepo, templatesClonePath);

const extractTemplate = (): R.ReaderTaskEither<Config, string, void> => ({
  templatesClonePath
}) =>
  pipe(
    Dir.copy(join(templatesClonePath, "typescript"), resolve(".")),
    TE.chain(() => Dir.remove(templatesClonePath))
  );

const config = {
  templatesRepo: "https://github.com/isthatcentered/create-templates.git",
  templatesClonePath: resolve(".", ".__templates")
};

const app: () => Promise<void> = () =>
  pipe(
    R.fromTaskEither<Config, string, TemplateConfig>(
      ask<TemplateConfig>(questions)
    ),
    // R.right<Config, string, undefined>( undefined ),
    R.chain(cloneTemplatesRepo),
    R.chain(extractTemplate),

    // configuretemplate
    R.chain(() => R.fromTaskEither(findTemplateFiles)),
    R.chain(files => R.fromTaskEither(promoteTemplateFiles(data)(files)))

    // installpackages
  )(config)()
    .then(E.fold(console.error, () => console.log("Done!")))
    .catch(console.error);

export default app;

const blah = () =>
  pipe(
    ask(questions),
    TE.chain(() => importTemplates),
    TE.chain(() => findTemplateFiles),
    TE.chain(promoteTemplateFiles(data))
    //install packages
  )()
    .then(E.fold(console.error, () => console.log("Done!")))
    .catch(console.error);
