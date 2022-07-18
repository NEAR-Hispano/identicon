export interface CreateAccountData {
  
}

export interface UpdateAccountData {
    uid: string;
    state?: string;
    type?: string;
    verified?: boolean;
    personal_info: PersonalInfoData;
}

export interface SubjectData {
    subject_id: string;
    verfiied: boolean;
    personal_info: PersonalInfoData;
}

export interface PersonalInfoData {
    full_name: string;
    birthday?: string;  // change to dob (date of birth)
    age?: number;
    sex?: string; // change to gender
    country: string;
    region?: string;
    comune?: string;
    address?: string;
    coordinates?: string;
    languages?: string;
    email?: string;
    phone?:string;
    preferred?: string;
    health?: string;
    extras?:string;
    dni:string;
}
export interface OTPData {
    email?: string;
    phone?: string;
    type?: string;
}

export interface LoginAccountData {
    session_key: string;
    passcode: string;
}

export interface AuthSessionData {
    token: string;
    id: string;
}