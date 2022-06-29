import create from "zustand";
import { persist } from "zustand/middleware"
import {AuthSessionData} from '../models/accounts'
interface AuthSesssionState {
  session: AuthSessionData;
  setSession: (value: AuthSessionData) => void;
  deleteSession: ()=> void;
}

const sessionInitialValue = {token: '', id: ''};

export const useStore = create<AuthSesssionState>(persist((set, get) => ({
  session: sessionInitialValue,
  setSession: (value: AuthSessionData) => set((state) => ({ ...state , session: value })),
  deleteSession: () => set((state)=> ({...state, session: sessionInitialValue}))
}),
{
  name: "auth"
}
));
  