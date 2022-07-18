import sessionApi from "./sessions";
import accountsApi from "./accounts";
import verificationsApi from "./verifications"

const api = {
  ...sessionApi,
  ...accountsApi,
  ...verificationsApi
};

export default api;
