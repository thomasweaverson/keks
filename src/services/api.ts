import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import { getToken } from "./token";
import { toast } from "react-toastify";
import { StatusCodes } from "http-status-codes";
import { BACKEND_URL, REQUEST_TIMEOUT } from "../const/infrastructure";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipToast?: boolean;
  }
  export interface InternalAxiosRequestConfig {
    skipToast?: boolean;
  }
}

type DetailMessageType = {
  type?: string;
  message?: string;
};

const StatusCodeMapping: Record<number, boolean> = {
  [StatusCodes.BAD_REQUEST]: true,
  [StatusCodes.UNAUTHORIZED]: true,
  [StatusCodes.NOT_FOUND]: true,
  [StatusCodes.INTERNAL_SERVER_ERROR]: true,
  [StatusCodes.BAD_GATEWAY]: true,
  [StatusCodes.SERVICE_UNAVAILABLE]: true,
  [StatusCodes.CONFLICT]: true
};

const shouldDisplayError = (response: AxiosResponse) =>
  !!StatusCodeMapping[response.status];

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use((config) => {
    const token = getToken();

    if (token) {
      config.headers["X-Token"] = token;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<DetailMessageType>) => {
      const shouldSkipToast = error.config?.skipToast;

      if (!shouldSkipToast) {
        if (error.response && shouldDisplayError(error.response)) {
          const errorMessage =
            error.response.data?.message || "Произошла ошибка при запросе";
          toast.warn(errorMessage);
        } else if (!error.response) {
          toast.warn("Сервер недоступен или отсутствует подключение");
        }
      }

      return Promise.reject(error);
    },
  );

  return api;
};
