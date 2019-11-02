import { Answers } from "inquirer";

declare module "testdouble-jest" {
  const _default: (...args: any[]) => void;
  export default _default;
}

declare module "inquirer" {
  interface Question<T extends Answers = Answers> {
    // name: string
  }
}
