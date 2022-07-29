import { useMutation, useQuery, useQueryClient } from "react-query";
import api from "../api";
import { AuthSessionData  } from "../models/accounts";
import { ValidationResultData } from '../models/validations'


export const useGetTasksAssigned = (session: AuthSessionData) => {
  return useQuery(
    "tasks_assigned",
    () => api.getTasksAssigned(session),
    {
      onError: (e) => {
        console.error(e);
      },
    }
  );
}

export const useGetSingleTask = (id: string) => {
  return useQuery(
    "single-task",
    () => api.getSingleTask(id),
    {
      onError: (e) => {
        console.error(e);
      },
    }
  );
}

export const useReportResult = (session: AuthSessionData) => {
  const { mutateAsync, isLoading, isSuccess, data } = useMutation(
    (params: ValidationResultData) => api.reportResult(params),
    {}
  );
  return {
    reportResult: mutateAsync,
    isProcessing: isLoading,
    isRequestSuccess: isSuccess,
    requestData: data
  };
}
