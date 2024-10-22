import { UserModel } from "@/api/users/types";
import { StateCreator, create } from "zustand";

export type UserSliceState = Partial<UserModel>;

export interface UserSliceActions {
  updateUser: (user: UserModel) => void
}

export type UserSlice = UserSliceState & UserSliceActions;

const initialState: UserSliceState = {};

const createUserSlice: StateCreator<UserSlice> = (set) => ({
  ...initialState,
  updateUser: (user) => set({ ...user }),
});
const useUserState = create(createUserSlice)
export default useUserState;