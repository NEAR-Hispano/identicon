import { useMutation, useQuery, useQueryClient } from "react-query";
import api from "../api";
import { AuthSessionData } from "../models/accounts";


export const useGetTasksAssigned = (session: AuthSessionData) => {
  return useQuery(
    "tasks_assigned",
    () => api.getTasksAssigned(session),
    {
      onError: (e) => {
        console.error(e);
      },
    }
  );
}

// export const useGetSingleVerification = (id) => {
//   return useQuery(
//     "single-verification",
//     () => api.getSingleVerification(id),
//     {
//       onError: (e) => {
//         console.error(e);
//       },
//     }
//   );
// }
