import { verifyAllWhenMocksCalled } from "jest-when"

beforeEach(() => reset())

afterEach(verifyAllWhenMocksCalled)

function reset() {
	jest.resetAllMocks()
	jest.restoreAllMocks()
}
