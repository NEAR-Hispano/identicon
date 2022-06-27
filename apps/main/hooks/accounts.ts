import { useMutation, useQuery } from "react-query";
import { AuthSessionData, LoginAccountData, OTPData, UpdateAccountData } from "../models/accounts";
import api from "../api";

export const useGetAccount = (session: AuthSessionData) => {
  const { data, isLoading } = useQuery(
    "acccount",
    () => api.getAccountById(session),
    {
      onError: (e) => {
        console.error(e);
      },
    }
  );
  return {
    isLoadinAccount: isLoading,
    data: data,
  };
};

export const useUpdateAccount = (session: AuthSessionData) => {
    const { mutateAsync, isLoading, isSuccess, data } = useMutation(
      (params: UpdateAccountData) => api.updateAccount({...params, session}),
      {}
    );
    return {
      updateAccount: mutateAsync,
      isUpdating: isLoading,
      isUpdateSuccess: isSuccess,
      updateData: data 
    };
  };