
import axios from "axios";
import { AuthSessionData, UpdateAccountData } from "../models/accounts";

export const baseUrl = `${process.env.GATEWAY_BASE_URL}`;

const api = {
  getAccountById: async (session: AuthSessionData) => {
    return axios
      .get(`${baseUrl}/v1/accounts/${session.id}`)
      .then((response) => response.data);
  },
  deleteAccount: async (id: string) => {
    return axios
      .delete(`${baseUrl}/v1/accounts/${id}`)
      .then((response) => response.data);
  },
  updateAccount: async (data: UpdateAccountData) => {
    return axios
      .put(`${baseUrl}/v1/accounts/${data.uid}`, data)
      .then((response) => response.data);
  },
};

export default api;