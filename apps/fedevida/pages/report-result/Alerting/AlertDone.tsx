import React from "react";
import  StatusNotice  from "../../../components/StatusNotice";
import { isVerificationDone } from "../../../constants/states";

const AlertDone = (props: any) => {
  const { data } = props;
  if (data && isVerificationDone(data.result))
    return <StatusNotice state={data.result} />;
  return <></>;
};
export default AlertDone;
