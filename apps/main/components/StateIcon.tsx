import * as React from "react";
import {
  MdDoneOutline, MdThumbDownOffAlt, MdPanTool, 
  MdOutlineClosedCaptionDisabled, 
  MdOutlineLocalFireDepartment
} from 'react-icons/md';

const StateIcon = (props) => {
  switch (props.result) {
    case 'Pending': return <MdPanTool />;
    case 'Approved': return <MdDoneOutline />;
    case 'Rejected': return <MdThumbDownOffAlt />;
    case 'NotPossible': return <MdOutlineLocalFireDepartment />
    case 'WillNotDo': return <MdOutlineClosedCaptionDisabled />;
    case 'Canceled': return <MdOutlineClosedCaptionDisabled />;
  }
  return(<></>)
}

export default StateIcon;
