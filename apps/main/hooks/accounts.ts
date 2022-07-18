import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  AuthSessionData,
  LoginAccountData,
  OTPData,
  UpdateAccountData,
} from "../models/accounts";
import api from "../api";

export const useGetAccount = (session: AuthSessionData) => {
  return useQuery(
    "acccount",
    () => api.getAccountById(session),
    {
      onError: (e) => {
        console.error(e);
      },
    }
  );
  // return {
  //   isLoadingAccount: isLoading,
  //   data: data,
  // };
};

export const useUpdateAccount = (session: AuthSessionData) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading, isSuccess, data } = useMutation(
    (params: UpdateAccountData) => api.updateAccount(params),
    {
      // onSuccess: (dataUpdate) => {
      //   console.log('dataupdate', dataUpdate)
      //   queryClient.setQueryData(['acccount'], dataUpdate)
      // },
      onSettled: () => queryClient.refetchQueries("account")
    }
  );
  return {
    updateAccount: mutateAsync,
    isUpdating: isLoading,
    isUpdateSuccess: isSuccess,
    updateData: data,
  };
};
