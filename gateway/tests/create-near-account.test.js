require("dotenv").config();
const creator = require("./run-create-account.js");

describe('Create NEAR implicit account', () => {
  it('should test that nearService is loaded', () => {

    creator.run();

    // expect(nearService !== null && nearService !== null ).toBe(true);
  })
})
