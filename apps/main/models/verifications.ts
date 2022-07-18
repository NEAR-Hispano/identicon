import { PersonalInfoData } from "./accounts";

export interface RequestVerificationData extends PersonalInfoData {
    type: "ProofOfLife" | "other";
    subject_id?: string;
    requestFor: "me" | "other";
    verificationType: "remote" | "onSite"
}