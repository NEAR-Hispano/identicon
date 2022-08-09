const nearApi = require("near-api-js");

const encodeJsonRpcData = (data) => {
  return Buffer.from(JSON.stringify(data)).toString("base64");
};

const decodeJsonRpcData = (data) => {
  let res = "";
  for (let i = 0; i < data.length; i++) {
    res += String.fromCharCode(data[i]);
  }
  return JSON.parse(res);
};

const getTxFunctionCallMethod = (finalExecOutcome) => {
  let method = undefined;
  if (finalExecOutcome.transaction?.actions?.length) {
    const actions = finalExecOutcome.transaction.actions;
    //recover methodName of first FunctionCall action
    for (let n = 0; n < actions.length; n++) {
      let item = actions[n];
      if ("FunctionCall" in item) {
        method = item.FunctionCall.method_name;
        break;
      }
    }
  }
  return method;
};

const getLogsAndErrorsFromReceipts = (txResult) => {
  let result = [];
  try {
    for (let ro of txResult.receipts_outcome) {
      //get logs
      for (let logLine of ro.outcome.logs) {
        result.push(logLine);
      }
      //check status.Failure
      if (ro.outcome.status.Failure) {
        result.push(JSON.stringify(ro.outcome.status.Failure));
      }
    }
  } catch (ex) {
    result.push("internal error parsing result outcome");
  } finally {
    return result.join("\n");
  }
};

const getPanicError = (txResult) => {
  try {
    for (let ro of txResult.receipts_outcome) {
      //check status.Failure
      if (ro.outcome.status.Failure) {
        return formatJSONErr(ro.outcome.status.Failure);
      }
    }
    return "";
  } catch (ex) {
    return "internal error parsing result outcome";
  }
};

const formatJSONErr = (obj) => {
  let text = JSON.stringify(obj);
  text = text.replace(/{/g, " ");
  text = text.replace(/}/g, " ");
  text = text.replace(/"/g, "");

  //---------
  //try some enhancements
  //---------
  //convert yoctoNEAR to near
  const largeNumbersFound = text.match(/\d{14,50}/g);
  if (largeNumbersFound) {
    for (const matches of largeNumbersFound) {
      const parts = matches.split(" ");
      const yoctoString = parts.pop() || "";
      if (yoctoString.length >= 20) {
        // convert to NEAR
        text = text.replace(
          new RegExp(yoctoString, "g"),
          yton(yoctoString).toString()
        );
      }
    }
  }

  //if panicked-at: return relevant info only
  //debug: console.error(text); //show info in the console before removing extra info
  const KEY = "panicked at ";
  const kl = KEY.length;
  let n = text.indexOf(KEY);
  if (n > 0 && n < text.length - kl - 5) {
    const i = text.indexOf("'", n + kl + 4);
    const cut = text.slice(n + kl, i);
    if (cut.trim().length > 5) {
      //debug: console.error(text.slice(n, i + 80)) //show info in the console before removing extra info
      text = cut;
    }
  }

  return text;
};

module.exports = {
  encodeJsonRpcData,
  decodeJsonRpcData,
  getPanicError,
  getTxFunctionCallMethod,
  getLogsAndErrorsFromReceipts,
};
