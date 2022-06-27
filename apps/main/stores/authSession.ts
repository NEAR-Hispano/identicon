import create from "zustand";
import {AuthSessionData} from '../models/accounts'
interface AuthSesssionState {
  session: AuthSessionData;
  setSession: (value: AuthSessionData) => void;
}

export const useStore = create<AuthSesssionState>((set) => ({
  session: {token: '', id: ''},
  setSession: (value: AuthSessionData) => set((state) => ({ ...state , session: value })),
}));
  