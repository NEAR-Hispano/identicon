require("dotenv").config();
const nearService = require("../src/services/near.service");

function run() {
  nearService.getConfig(process.env.MASTER_ACCOUNT_ID, process.env.MASTER_PRIVATE_KEY)
    .then((sts) => {
      console.log("DONE=", sts);
    })
    .catch((err) => {
      console.log("ERR=", err);
    });

  nearService.createImplicitAccount()
    .then((sts) => {
      console.log("DONE=", sts);
    })
    .catch((err) => {
      console.log("ERR=", err);
    });
}

run();

module.exports = {
  run
}
