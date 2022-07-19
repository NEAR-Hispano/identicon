async function callContract(method, args, signerId, privateKey) {
  /**
   * Call a contract method
   * 
   * @method: the name of the method to call in the CONTRACT_ID
   * @args: obj with arg name and value - empty object if no args required
   * @signerId: account Id of caller and signer, ex: "maz.testnet"
   * @privatekey: private key of signer account, ex: "29z...rLG"
   * 
   * @exampĺe:
   * let { result, error } = callContract(
   *   "request_verification", { 
   *      "uid": "ABCD1234607", 
   *      "is_type": "ProofOfLife", 
   *      "subject_id": "AR_DNI_12345678907", 
   *      "payload": "Simulated encrypted PAYLOAD"          
   *   }, 
   *   "maz.testnet", "29z...rLG"
   * );
   * 
   * @returns: { result, error } with result if success, error otherwise
   */
  try {
    if (!Object.values(viewMethods).contains(method) ||
      !Object.values(changeMethods).contains(method))
      throw `Invalid method in '${CONTRACT_ID}'.`;

    const config = await getConfig(signerId, privateKey);
    const near = await connect(config);
    const signer = await near.account(signerId);

    const contract = new nearAPI.Contract(
      signer, // the account object that is connecting
      CONTRACT_ID, // name of contract we're connecting to
      {
        // view methods do not change state but usually return a value
        viewMethods: Object.values(viewMethods),
        // change methods modify state
        changeMethods: Object.values(changeMethods),
        sender: signer, // account object to initialize and sign transactions.
      }
    );

    let ret = await contract[method](
      args, // the args obj: name and value - empty object if no args required
      ATTACHED_GAS // optional attached gas
      // "1000000000000000000000000" // attached deposit in yoctoNEAR (optional)
    );

    console.info(`called ${method}(${JSON.stringify(args)}):`, ret);
    return {
      result: ret
    };
  } catch (error) {
    console.log(`called ${method}(${JSON.stringify(args)}): ${error}`);
    return {
      error: error
    };
  }
}
