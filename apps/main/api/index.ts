import sessionApi from "./sessions";
import accountsApi from "./accounts";
import verificationsApi from "./verifications";
import tasksApi from './tasks';

const api = {
  ...sessionApi,
  ...accountsApi,
  ...verificationsApi,
  ...tasksApi
};

export default api;
