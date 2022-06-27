
import axios from "axios";
import { AuthSessionData, UpdateAccountData } from "../models/accounts";
import {useStore} from "..//stores/authSession";

export const baseUrl = `${process.env.GATEWAY_BASE_URL}`;

const api = {
  getAccountById: async (session: AuthSessionData) => {
  // todo: move auth token to local storage
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${session.token}`;
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
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${data.session.token}`;
    return axios
      .put(`${baseUrl}/v1/accounts/${data.uid}`, data)
      .then((response) => response.data);
  },
};

export default api;