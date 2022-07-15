import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  RequestVerificationData
} from "../models/verifications";
import api from "../api";
import { AuthSessionData } from "../models/accounts";

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
