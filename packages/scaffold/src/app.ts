import { pipe } from "fp-ts/lib/pipeable";
import * as R from "fp-ts/lib/ReaderTaskEither";
import { cloneRepo } from "./Github";
import * as TE from "fp-ts/lib/TaskEither";
import { always } from "ramda";
import { pass, renderTemplate, stripHbsExtension, todoList } from "./random";
import * as Dir from "./Directory";
import { join, resolve } from "path";
import * as File from "./File";

const findTemplateFiles: (
  path: string
) => TE.TaskEither<string, string[]> = path => File.find(/.hbs/i, path);

const cloneTemplatesRepo: () => R.ReaderTaskEither<
  AppConfig,
  string,
  void
> = () => ({ templatesRepo, templatesClonePath }) =>
  cloneRepo(templatesRepo, templatesClonePath);

const extractTemplate: () => R.ReaderTaskEither<
  AppConfig,
  string,
  void
> = () => ({ templatesClonePath, template, path }) =>
  Dir.copy(join(templatesClonePath, template), resolve(path));

const applyPackageConfig: () => R.ReaderTaskEither<
  AppConfig,
  string,
  void
> = () => config =>
  pipe(
    findTemplateFiles(config.path),
    TE.chain(todoList(file => File.overwrite(renderTemplate(config), file))),
    TE.map(pass)
  );

const stripTemplateExtension: (
  file: string
) => TE.TaskEither<string, typeof file> = file =>
  pipe(
    File.rename(file, stripHbsExtension(file)),
    TE.map(always(stripHbsExtension(file)))
  );

const cleanUp: () => R.ReaderTaskEither<AppConfig, string, void> = () => ({
  templatesClonePath,
  path
}) =>
  pipe(
    findTemplateFiles(path),
    TE.chain(todoList(stripTemplateExtension)), // this should be a data config pipeline and the io operations should be done at the edges
    TE.chain(() => Dir.remove(templatesClonePath))
  );

export type PackageConfig = {
  package_name: string;
  package_description: string;
  path: string;
  template: string;
};

type AppConfig = {
  templatesRepo: string;
  templatesClonePath: string;
} & PackageConfig;

export const app = pipe(
  R.right<AppConfig & PackageConfig, string, void>(undefined),
  R.chain(cloneTemplatesRepo),
  R.chain(extractTemplate),
  R.chain(applyPackageConfig),
  R.chain(cleanUp)
);
