module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	rootDir: "./src",
	setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
}
