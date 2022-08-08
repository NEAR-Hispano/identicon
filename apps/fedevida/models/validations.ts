import { PersonalInfoData } from "./accounts";

export interface UpdateValidationResultData {
  uid: string;
  matches: string;
  result: string;
  contents?: string;
  remarks?: string;
}

export interface ValidationResultData {
    uid: string;
    matches: string;
    result: string;
    contents?: string;
    remarks?: string;
}
