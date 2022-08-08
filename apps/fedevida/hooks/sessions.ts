import { useMutation, useQuery } from "react-query";
import { LoginAccountData, OTPData } from "../models/accounts";
import api from "../api";
import { useToast } from "@chakra-ui/toast";

export const useSignUp = () => {
  const toast = useToast()
  const { mutate, isLoading, isSuccess, data, isError, error } = useMutation(
    (accountData: OTPData) => api.signUp(accountData),
    {
       onError: (error: any) => {
        toast({
          title: `Sign up fails: ${error.response.data.msg}`,
          status: "error",
          duration: 9000,
          position: "top-right",
          isClosable: true,
        });
       }
    }
  );
  return {
    signUp: mutate,
    isSigningUp: isLoading,
    isSignUpSuccess: isSuccess,
    signUpData: data,
    isSignUpError: isError,
    signUpError: error
  };
};

export const useLogin = () => {
  const toast = useToast()
  const { mutateAsync, isLoading, isSuccess, data, isError } = useMutation(
    (loginData: LoginAccountData) => api.login(loginData),
    {
      onError: (error: any) => {
        toast({
          title: `Login fails: ${error.response.data.msg}`,
          status: "error",
          duration: 9000,
          position: "top-right",
          isClosable: true,
        });
       }
    }
  );
  return {
    login: mutateAsync,
    isLogginIn: isLoading,
    isLoginSuccess: isSuccess,
    loginData: data,
    isLoginError: isError
  };
};

export const useRecovery = () => {
  const toast = useToast()
  const { mutateAsync, isLoading, isSuccess, data, isError } = useMutation(
    (params: OTPData) => api.recovery(params),
    {
      onError: (error: any) => {
        toast({
          title: `Session recovery fails: ${error.response.data.msg}`,
          status: "error",
          duration: 9000,
          position: "top-right",
          isClosable: true,
        });
       }
    }
  );
  return {
    recovery: mutateAsync,
    isRecovering: isLoading,
    isRecoverySuccess: isSuccess,
    recoveryData: data,
    isRecoveryError: isError
  };
};
