import { useMutation, useQuery } from "react-query";
import { LoginAccountData, OTPData } from "../models/accounts";
import api from "../api";

export const useSignUp = () => {
  const { mutateAsync, isLoading, isSuccess, data } = useMutation(
    (accountData: OTPData) => api.signUp(accountData),
    {}
  );
  return {
    signUp: mutateAsync,
    isSigningUp: isLoading,
    isSignUpSuccess: isSuccess,
    signUpData: data 
  };
};

export const useLogin = () => {
  const { mutateAsync, isLoading, isSuccess, data } = useMutation(
    (loginData: LoginAccountData) => api.login(loginData),
    {}
  );
  return {
    login: mutateAsync,
    isLogginIn: isLoading,
    isLoginSuccess: isSuccess,
    loginData: data
  };
};

export const useRecovery = () => {
  const { mutateAsync, isLoading, isSuccess, data } = useMutation(
    (params: OTPData) => api.recovery(params),
    {}
  );
  return {
    recovery: mutateAsync,
    isRecovering: isLoading,
    isRecoverySuccess: isSuccess,
    recoveryData: data
  };
};
