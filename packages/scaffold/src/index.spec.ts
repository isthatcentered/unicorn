function importLib(env: "prod" | "test" = "test") {
  return env === "prod" ? require("../.") : require("./index.ts");
}

const _lib = importLib("prod"); // will not work with async

test(`It can be called`, () => {
  _lib();
  expect(true).toBe(true);
});
