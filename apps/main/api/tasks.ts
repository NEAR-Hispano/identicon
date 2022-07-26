import axios from "axios";
import { AuthSessionData, UpdateAccountData } from "../models/accounts";
import { RequestVerificationData } from "../models/verifications";
import { VerificationStates } from "../constants/states";

export const baseUrl = `${process.env.GATEWAY_BASE_URL}`;

const api = {

  getTasksAssigned: async (session: AuthSessionData) => {
    return axios
      .get(`${baseUrl}/v1/tasks/assigned`, { params: {
        order: 'asc'
      }})
      .then((response) => response.data);
  },

  // getSingleVerification: async (id) => {
  //   return axios
  //     .get(`${baseUrl}/v1/verifications/${id}`)
  //     .then((response) => response.data);
  // },
};

export default api;
