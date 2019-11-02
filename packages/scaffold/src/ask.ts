import inquirer, { Question } from "inquirer";
import { propAny, type } from "./random";
import * as TE from "fp-ts/lib/TaskEither";
import { compose } from "ramda";

type Prompt = Omit<Question<any>, "name">;

export type Prompts<T extends Record<string, any>> = {
  [P in keyof T]: Prompt;
};

const safeInquire = <T>(prompts: Question[]): TE.TaskEither<string, T> =>
  TE.tryCatch(
    () => inquirer.prompt(prompts).then(type<T>()),
    compose(propAny<Error>("message"))
  );

export const ask = <T>(questions: Prompts<T>): TE.TaskEither<string, T> => {
  const prompts: Question[] = Object.keys(questions).map(key => ({
    ...questions[(key as any) as keyof T],
    name: key
  }));

  return safeInquire(prompts);
};
