require("dotenv").config();
const nearService = require("../src/services/near.service");

describe('Create NEAR implicit account', () => {

  it('should test that nearService is loaded', () => {
    expect(nearService !== null && nearService !== null ).toBe(true);
  })

  it('should call contract method', async () => {
    // get keys from "~/.near-creadentials/testnet/maz.testnet"
    const accountId = "maz.testnet";
    const privateKey = "29zswem7XBCQw9vsSmtj9AJoMFaHKCbzAZs79Q5tjxFRZkiTvDhJSuUta5WKgY4U36snwoEbTW4ZCnQhAG7QTrLG";

    const [status, results] = await nearService.callContract(
        "request_verification", 
        { // param name and value - pass empty object if no args required
            "uid": "ABCD1234607", 
            "is_type": "ProofOfLife", 
            "subject_id": "AR_DNI_12345678907", 
            "payload": "Simulated encrypted PAYLOAD"          
        },
        accountId, privateKey
    );
    console.log("callContract status=", status, "results=", results)
    expect(status !== null && results !== null).toBe(true);
  })
})
