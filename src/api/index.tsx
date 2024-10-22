import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from "axios";
import { getAuthTokens, refreshAccessToken, removeAuthToken, setAuthTokens } from "@/api/auth";
import { ErrorResponse } from "./general.types";
import { Mutex } from "async-mutex";

export const baseURL = import.meta.env.VITE_API_BASE_URL;
const mutex = new Mutex();

const axiosInstance = axios.create({
  timeout: 15000,
  baseURL,
});

const handleAxiosError = (error: unknown) => {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    if (error.response) {
      const message = error.response.data.message;
      return Promise.reject(Array.isArray(message) ? message.join(", ") : message);
    }
  }
  return Promise.reject("Unknown error");
};

export const makeApiRequest = async <T,>(
  request: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance.request(request);
    return response;
  } catch (error) {
    return handleAxiosError(error);
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const tokens = getAuthTokens();
    if (tokens) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${tokens.accessToken}`,
      } as unknown as AxiosRequestHeaders;
    }

    if (config.method == "post") {
      config.headers = {
        ...config.headers,
        Accept: "application/json",
        "Content-Type": "application/json",
      } as unknown as AxiosRequestHeaders;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

async function handleRetryRequestWithTokenRefresh(error: AxiosError) {
  return mutex.acquire().then(async (release) => {
    if (error.response) {
      if (error.response.status === 401) {
        const tokens = getAuthTokens();
        if (!tokens) {
          release();
          console.log("No tokens force logout!");
          return forceLogout();
        }
        try {
          const tokens = await refreshAccessToken();
          setAuthTokens(tokens.accessToken, tokens.refreshToken);
          const config = error.config as any;
          config.headers["Authorization"] = `Bearer ${tokens.accessToken}`;
          release();
          return axiosInstance(config);
        } catch (refreshError) {
          release();
          console.log("Error refreshing token!");

          return forceLogout();
        }
      } else {
        release();
        return Promise.reject(error);
      }
    }
    release();
    return Promise.reject(error);
  });
}

const forceLogout = (): Promise<string> => {
  removeAuthToken();
  window.location.assign("/auth/sign-in");
  return Promise.reject("No tokens logout");
};

axiosInstance.interceptors.response.use(async (response) => {
  return response;
}, handleRetryRequestWithTokenRefresh);

export default axiosInstance;
