import execa, { ExecaReturnBase } from "execa";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { array } from "fp-ts/lib/Array";
import * as Dir from "./Directory";
import { prependString, propAny } from "./random";

const pass = () => undefined;

const log = (tag: string) => <T>(data: T) => {
  console.log(tag, data);

  return data;
};

const cloneRepo = (repo: string, path: string): TE.TaskEither<string, void> =>
  pipe(
    TE.tryCatch(
      () => execa("git", ["clone", repo, path]).then(pass),
      propAny<ExecaReturnBase<any>>("stderr")
    ),
    TE.mapLeft(prependString("[GIT CLONE]"))
  );

const templatesClonePath = "./.__templates";

const template = "typescript",
  path = "./";

export default () =>
  array
    .sequence(TE.taskEitherSeq)([
      cloneRepo(
        "https://github.com/isthatcentered/create-templates.git",
        templatesClonePath
      ),
      Dir.copy(templatesClonePath + "/" + template, path),
      Dir.remove(templatesClonePath)
      // process hbs
      // stip .hbs
      // install packages
    ])()
    .then(E.fold(console.error, () => console.log("Done!")));

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
