import {  useQuery } from "react-query";
import api from "../api";
import { Credential  } from "../models/credentials";



export const useGetCredentialMetadata = (token_id: string) => {
  return useQuery(
    "credential-metadata",
    () => api.useGetCredentialMetadata(token_id),
    {
      onError: (e) => {
        console.error(e);
      },
    }
  );
}
