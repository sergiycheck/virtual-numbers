import axiosInstance, { makeApiRequest } from "@/api";
import axios from "axios";
import { baseURL } from "@/api";

export const setAuthTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const getAuthTokens = (): AuthResponse | null => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  if (!!accessToken && !!refreshToken) {
    return {
      accessToken,
      refreshToken,
    };
  }
  return null;
};

export const removeAuthToken = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const isAuthenticated = () => {
  const accessToken = getAuthTokens();
  return !!accessToken;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export type VerifyOtpResponse = {
  message: string;
};

export type Login2FARequireDTO = {
  verificationToken: string;
};

export type Login2FADataFromVerificationToken = {
  id: string;
  role: string;
  isOTPAuthRequired: boolean;
  isPhoneAuthRequired: boolean;
};

export interface LogInFormData {
  email: string;
  password: string;
}

export const logInUser = async (credentials: LogInFormData) => {
  return axios<AuthResponse | Login2FARequireDTO>({
    baseURL,
    url: "/auth/login",
    method: "post",
    data: credentials,
  });
};

export const logOutUser = async () => {
  try {
    const response = await axiosInstance.post<AuthResponse>("/auth/logout");
    removeAuthToken();
    return response;
  } catch {
    removeAuthToken();
    throw Error("Logout failed");
  }
};

export const refreshAccessToken = async () => {
  const tokens = getAuthTokens();
  if (!tokens) return Promise.reject("Refresh accessToken is not provided");
  try {
    const response = await axios.get<AuthResponse>("/auth/refresh", {
      baseURL,
      headers: {
        Authorization: `Bearer ${tokens.refreshToken}`,
      },
    });

    return response.data;
  } catch {
    return Promise.reject("Error with accessToken refreshing");
  }
};

export const resendEmailconfirmation = async (email?: string) => {
  return makeApiRequest({
    method: "post",
    url: `/users/activate/resend${email ? `?email=${email}` : ""}`,
  });
};

export const getAuthOptSetup = () => {
  return makeApiRequest<{ qrCode: string }>({
    method: "get",
    url: "/auth/otp/setup",
  });
};

export const authOtpSetupVerify = ({ code }: { code: string }) => {
  return makeApiRequest<VerifyOtpResponse>({
    method: "post",
    url: "/auth/otp/setup-verify",
    data: { code },
  });
};

export const authTextMsgSetupPhone = ({ phone }: { phone: string }) => {
  return makeApiRequest<VerifyOtpResponse>({
    method: "post",
    url: "/auth/text-msg/setup-phone",
    data: { phone },
  });
};

export const authTextMsgSetupVerify = ({ code }: { code: string }) => {
  return makeApiRequest<VerifyOtpResponse>({
    method: "post",
    url: "/auth/text-msg/setup-verify",
    data: { code },
  });
};

export const authOtpRemove = () => {
  return makeApiRequest<VerifyOtpResponse>({
    method: "delete",
    url: "/auth/otp/remove",
  });
};

export const authTextMessageRemove = () => {
  return makeApiRequest<VerifyOtpResponse>({
    method: "delete",
    url: "/auth/text-msg/remove",
  });
};

export const auth2faVerify = ({
  code,
  verificationToken,
}: {
  code: string;
  verificationToken: string;
}) => {
  return axios<AuthResponse>({
    method: "post",
    baseURL,
    url: "/auth/2fa/verify",
    data: { code },
    headers: {
      Authorization: `Bearer ${verificationToken}`,
    },
  });
};

export const authRevokeConnectedAccount = ({ provider }: { provider: string }) => {
  return makeApiRequest({
    method: "delete",
    url: `/auth/${provider}/revoke`,
  });
};
