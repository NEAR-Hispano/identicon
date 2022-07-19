require("dotenv").config();
const config = require('../src/config');
const { sequelize } = require('../src/models');
const express = require('express');
const nearService = require('../src/services/near.service');
const AccountsService = require("../src/services/accounts.service");
const AuthService = require("../src/services/auth.service");
const { getAccountOrError } = require('../src/controllers/controllers.helpers');
const app = express();

// Simulate session 
let session = {
  type: "VL",
  contact: 'mazito.v2+maz0x5@gmail.com'
};


describe('Create NEAR implicit account', () => {

  it('should test that nearService is loaded', async () => {
    await sequelize.sync({ 
      // force: true,
      // alter: true 
    });
    expect(nearService !== null && nearService !== null ).toBe(true);
  });

  it('should create a new account with no error', async () => {

    // Check if it exists or create it
    let acc1 = await AccountsService.getAccountByContact(
      session.contact
    );
    let uid = acc1 ? acc1.uid : '0';
    let [account, error] = await getAccountOrError(uid);

    if (error) {
      console.log(`CREATE: Creating a new Account for ${session.contact}`);

      let [nearAccount, receipt] = await nearService.createImplicitAccount();
      console.log("NEAR account", nearAccount);

      let created = await AccountsService.createAccount(session, nearAccount);
      [account, error] = await getAccountOrError(created.uid);

      if (session.type === 'VL') {
        //await nearService.registerAsValidator({can_do: ['Remote']}, account);        
      }     
    }
    else {
      console.log(`EXISTS: Account ${session.contact} already exists`);
      if (session.type === 'VL') {
        await nearService.registerAsValidator({ can_do: ['Remote'] }, account);        
      }     
    }

    // generate AUTH_key
    const payload = {
      account_data: {
        id: account.uid,
        email: account.email,
        phone: account.phone,
        verified: account.verified,
        user_type: account.user_type
      },
      near_account_data: {
        //TBD if we want to return near account data, eg account id
        account_id: account.linked_account_uid
      }
    };

    const token = AuthService.generateAccessToken(payload);
    console.log(`AUTH_KEY="${token}"`);
    expect(account !== null).toBe(true);
  });
});
