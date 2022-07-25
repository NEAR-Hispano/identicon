require("dotenv").config();
const nearService = require("../src/services/near.service");

describe('Call contracts', () => {

  it('should test that nearService is loaded', () => {
    expect(nearService !== null && nearService !== null ).toBe(true);
  })

  it('should call contract method', async () => {
    // get keys from "~/.near-creadentials/testnet/maz.testnet"
    const accountId = "maz.testnet";
    const privateKey = "29zswem7XBCQw9vsSmtj9AJoMFaHKCbzAZs79Q5tjxFRZkiTvDhJSuUta5WKgY4U36snwoEbTW4ZCnQhAG7QTrLG";

    const [status, ret] = await nearService.callContract(
        "request_verification", 
        { // param name and value - pass empty object if no args required
            "uid": "ABCD1234609", 
            "is_type": "ProofOfLife", 
            "subject_id": "AR_DNI_12345678910", 
            "payload": "Simulated encrypted PAYLOAD"          
        },
        accountId, privateKey
    );
    expect(status && ret !== null).toBe(true);
  })
})
