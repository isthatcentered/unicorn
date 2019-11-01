import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import * as Dir from "./Directory";
import { renderTemplate, stripHbsExtension } from "./random";
import * as File from "./File";
import { always, curry, map } from "ramda";
import { array } from "fp-ts/lib/Array";
import { cloneRepo } from "./Github";

const templatesClonePath = "./.__templates";

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

const stripHbsExtensionForTemplateFiles = (
  file: string
): TE.TaskEither<string, typeof file> =>
  pipe(
    File.rename(file, stripHbsExtension(file)),
    TE.map(always(stripHbsExtension(file)))
  );

export default () =>
  pipe(
    importTemplates,
    TE.chain(() => findTemplateFiles),
    TE.map(map(renderFile(data))),
    TE.chain(array.sequence(TE.taskEither)),
    TE.map(map(stripHbsExtensionForTemplateFiles)),
    TE.chain(array.sequence(TE.taskEither))
  )().then(E.fold(console.error, () => console.log("Done!")));

// const commander = require('commander');
// const program = new commander.Command();
// program.version('0.0.1');
//
// program
// 	.option('-d, --debug', 'output extra debugging')
// 	.option('-s, --small', 'small pizza size')
// 	.option('-p, --pizza-type <type>', 'flavour of pizza');
//
// program.parse(process.argv);
//
// if (program.debug) console.log(program.opts());
// console.log('pizza details:');
// if (program.small) console.log('- small pizza size');
// if (program.pizzaType) console.log(`- ${program.pizzaType}`);
// const inquirer = require('inquirer');
//
// const questions = [
// 	{ type: 'list', name: 'coffeType', message: 'Choose coffee type', choices: ["a", "b"] },
// 	{ type: 'list', name: 'sugarLevel', message: 'Choose your sugar level', choices: ["a", "b"] },
// 	{ type: 'confirm', name: 'decaf', message: 'Do you prefer your coffee to be decaf?', default: false },
// 	{ type: 'confirm', name: 'cold', message: 'Do you prefer your coffee to be cold?', default: false },
// 	{ type: 'list', name: 'servedIn', message: 'How do you prefer your coffee to be served in', choices: ["a", "b"] },
// 	{ type: 'confirm', name: 'stirrer', message: 'Do you prefer your coffee with a stirrer?', default: true },
// ];
//
// inquirer
// 	.prompt(questions)
// 	.then(function (answers) {
// 		console.log(answers);
// 	})
