import * as React from "react";
import {
  MdDoneOutline, MdThumbDownOffAlt, MdPanTool, 
  MdOutlineClosedCaptionDisabled, 
  MdOutlineLocalFireDepartment
} from 'react-icons/md';
import { colors } from '../constants/colors';

const StateIcon = (props) => {
  switch (props.result) {
    case 'Pending': return <MdPanTool color={colors.yellow['400']}/>;
    case 'Approved': return <MdDoneOutline  color={colors.green['400']}/>;
    case 'Rejected': return <MdThumbDownOffAlt  color={colors.red['400']}/>;
    case 'NotPossible': return <MdOutlineLocalFireDepartment  color={colors.red['600']}/>
    case 'WillNotDo': return <MdOutlineClosedCaptionDisabled  color={colors.red['600']}/>;
    case 'Canceled': return <MdOutlineClosedCaptionDisabled  color={colors.gray['400']}/>;
  }
  return(<></>)
}

export default StateIcon;
