import "jest-extended";
import { matchers } from "jest-json-schema";
// import "jest-plugin-must-assert"
// https://github.com/testdouble/testdouble-jest
import td from "testdouble";
import tdjest from "testdouble-jest";

tdjest(td, jest);
expect.extend(matchers);
