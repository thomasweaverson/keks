import axios from "axios";
import type { CustomServerError } from "../types/state";

export const extractCustomServerError = (error: unknown): CustomServerError => {
  if (axios.isAxiosError(error) && error.response) {
    const data = error.response.data as { message?: string } | undefined;
    return {
      status: error.response.status,
      message: data?.message || error.message,
    };
  }

  return {
    status: 500,
    message: "Unknown error",
  };
};
