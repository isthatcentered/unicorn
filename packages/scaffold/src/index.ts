import * as E from "fp-ts/lib/Either";
import { resolve } from "path";
import { app } from "./app";

const config = {
  templatesRepo: "https://github.com/isthatcentered/create-templates.git",
  templatesClonePath: resolve(".", ".__templates")
};

export default () =>
  app(config)()
    .then(E.fold(console.error, () => console.log("Done!")))
    .catch(console.error);
