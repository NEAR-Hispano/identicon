import sessionApi from "./sessions";
import accountsApi from "./accounts";
import verificationsApi from "./verifications";
import tasksApi from './tasks';
import credentialsApi from './credentials';

const api = {
  ...sessionApi,
  ...accountsApi,
  ...verificationsApi,
  ...tasksApi,
  ...credentialsApi
};

export default api;
