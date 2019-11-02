import * as R from "fp-ts/lib/ReaderTaskEither";
import { pipe } from "fp-ts/lib/pipeable";

function importLib(env: "prod" | "dev" = "dev") {
  return env === "prod" ? require("../.") : require("./index.ts");
}

const _lib = importLib("dev"); // will not work with async

type env = { package_name: string };
it("map", () => {
  const app = pipe(
    R.right<env, string, number>(5),
    R.map(version => version * 2),
    R.chain(version =>
      R.asks(env => ({
        ...env,
        version
      }))
    )
  );

  app({ package_name: "@isthatcentered/blah" })().then(console.log);
});

test(`Blank`, () => {
  expect(true).toBe(true);
});
