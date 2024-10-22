import { makeApiRequest } from "..";
import { UserModel } from "../users/types";

interface CreateSubUserBody {
  fullName?: string;
  userName?: string;
  email: string;
  password?: string;
}

interface UpdateSubUserBody {
  subUserId: string;
  fullName: string;
  userName: string;
  email: string;
  password: string;
}

const AdminUsersAPI = {
  create: (data: CreateSubUserBody) =>
    makeApiRequest({
      method: "post",
      url: "/users/sub-users",
      data: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }),
  list: () =>
    makeApiRequest<UserModel[]>({
      method: "get",
      url: "/users/sub-users",
    }),
  get: (id: string) =>
    makeApiRequest<UserModel>({
      method: "get",
      url: `/users/sub-users/${id}`,
    }),
  update: (id: string, data: UpdateSubUserBody) =>
    makeApiRequest({
      method: "patch",
      url: `/users/sub-users/${id}`,
      data: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }),
  delete: (id: string) =>
    makeApiRequest<UserModel>({
      method: "delete",
      url: `/users/sub-users/${id}`,
    }),
};

export default AdminUsersAPI;
