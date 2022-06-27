import sessionApi from "./sessions";
import accountsApi from "./accounts";

const api = {
  ...sessionApi,
  ...accountsApi,
};

export default api;
