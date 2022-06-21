require("dotenv").config();
const nearService = require("../src/services/near.service");

describe('Create NEAR implicit account', () => {

  it('should test that nearService is loaded', () => {
    expect(nearService !== null && nearService !== null ).toBe(true);
  })

  it('should call contract method', async () => {
    const [status, results] = await nearService.callContract(
        "request_verification", {
            // argument name and value - pass empty object if no args required
            "uid": "ABCD1234606", 
            "is_type": "ProofOfLife", 
            "subject_id": "AR_DNI_12345678906", 
            "payload": "Simulated encrypted PAYLOAD"          
        }
    );
    console.log("callContract status=", status, "results=", results)
    expect(status !== null && results !== null).toBe(true);
  })
})
