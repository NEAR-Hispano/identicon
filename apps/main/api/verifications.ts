import axios from "axios";
import { AuthSessionData, UpdateAccountData } from "../models/accounts";
import { RequestVerificationData } from "../models/verifications";

export const baseUrl = `${process.env.GATEWAY_BASE_URL}`;

const api = {
  requestVerification: async (data: RequestVerificationData) => {
    return axios
      .post(`${baseUrl}/v1/verifications`, {type: data.type, subject_id: data.subject_id, personal_info: {...data}})
      .then((response) => response.data);
  },

  getVerifications: async (session: AuthSessionData) => {
    return axios
      .get(`${baseUrl}/v1/verifications`, { params: {
        requester_uid: session.id,
        states: ['UN','PN','ST']
      }})
      .then((response) => response.data);
  },
};

export default api;
