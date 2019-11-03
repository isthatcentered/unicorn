import { pipe } from "fp-ts/lib/pipeable";
import * as R from "fp-ts/lib/ReaderTaskEither";
import { ask, Prompts } from "./ask";
import { cloneRepo } from "./Github";
import * as TE from "fp-ts/lib/TaskEither";
import { always } from "ramda";
import { renderTemplate, stripHbsExtension, todoList } from "./random";
import * as Dir from "./Directory";
import { join, resolve } from "path";
import * as File from "./File";

const findTemplateFiles = (path: string): TE.TaskEither<string, string[]> =>
  File.find(/.hbs/i, path);
const cloneTemplatesRepo = (
  params: PackageConfig
): R.ReaderTaskEither<Config, string, PackageConfig> => ({
  templatesRepo,
  templatesClonePath
}) =>
  pipe(
    cloneRepo(templatesRepo, templatesClonePath),
    TE.map(always(params))
  );
const extractTemplate = (
  params: PackageConfig
): R.ReaderTaskEither<Config, string, PackageConfig> => ({
  templatesClonePath
}) =>
  pipe(
    Dir.copy(join(templatesClonePath, params.template), resolve(params.path)),
    TE.map(always(params))
  );
const applyPackageConfig = (
  params: PackageConfig
): R.ReaderTaskEither<Config, string, PackageConfig> => config =>
  pipe(
    findTemplateFiles(params.path),
    TE.chain(todoList(file => File.overwrite(renderTemplate(params), file))),
    TE.map(always(params))
  );
const stripTemplateExtension = (
  file: string
): TE.TaskEither<string, typeof file> =>
  pipe(
    File.rename(file, stripHbsExtension(file)),
    TE.map(always(stripHbsExtension(file)))
  );
const cleanUp = (
  params: PackageConfig
): R.ReaderTaskEither<Config, string, PackageConfig> => ({
  templatesClonePath
}) =>
  pipe(
    findTemplateFiles(params.path),
    TE.chain(todoList(stripTemplateExtension)), // this should be a data config pipeline and the io operations should be done at the edges
    TE.chain(() => Dir.remove(templatesClonePath)),
    TE.map(always(params))
  );
export type PackageConfig = {
  package_name: string;
  package_description: string;
  path: string;
  template: string;
};
type Config = {
  templatesRepo: string;
  templatesClonePath: string;
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

export const app = pipe(
  R.fromTaskEither<Config, string, PackageConfig>(ask<PackageConfig>(prompts)),
  R.chain(cloneTemplatesRepo),
  R.chain(extractTemplate),
  R.chain(applyPackageConfig),
  R.chain(cleanUp)
);
