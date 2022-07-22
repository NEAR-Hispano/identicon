import { useMutation, useQuery, useQueryClient } from "react-query";
import { RequestVerificationData } from "../models/verifications";
import api from "../api";
import { AuthSessionData, UpdateAccountData } from "../models/accounts";

export const useRequestVerification = (session: AuthSessionData) => {
  const { mutateAsync, isLoading, isSuccess, data } = useMutation(
    (params: RequestVerificationData) => api.requestVerification(params),
    {
    }
  );
  return {
    requestVerification: mutateAsync,
    isProcessing: isLoading,
    isRequestSuccess: isSuccess,
    requestData: data
  };
};

export const useGetVerifications = (session: AuthSessionData) => {
  return useQuery(
    "verifications",
    () => api.getVerifications(session),
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
