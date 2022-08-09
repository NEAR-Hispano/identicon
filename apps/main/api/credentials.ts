import axios from "axios";
import { AuthSessionData } from "../models/accounts";
import { Credential } from "../models/credentials";

export const baseUrl = `${process.env.GATEWAY_BASE_URL}`;

const api = {
  useGetCredentialMetadata: async (token_id: string) => {
    return axios
      .get(`${baseUrl}/v1/credentials/${token_id}`)
      .then((response) => response.data);
  },
};

export default api;
