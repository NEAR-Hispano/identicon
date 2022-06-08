require("dotenv").config();
const nearService = require("../src/services/near.service");

describe('Create NEAR implicit account', () => {

  it('should test that nearService is loaded', () => {
    expect(nearService !== null && nearService !== null ).toBe(true);
  })

  it('should create a new account with no error', async () => {
    const [account, receipt] = await nearService.createImplicitAccount();
    expect(account !== null && receipt !== null).toBe(true);
  })
})
