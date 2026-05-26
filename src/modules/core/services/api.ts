import axios from "axios";

const DEFAULT_API_TIMEOUT = 10000;
const DEFAULT_ERROR_STATUS = 500;
const DEFAULT_ERROR_MESSAGE = "Internal Server Error";
const DEFAULT_BASE_URL = "https://dummyjson.com";

export type GenericErrorResponse = {
  status: number;
  errorMsg: string;
};

export const errorBuilder = (
  status: number | undefined,
  errorMsg: string | undefined,
): GenericErrorResponse => {
  return {
    status: status ? status : DEFAULT_ERROR_STATUS,
    errorMsg: errorMsg ? errorMsg : DEFAULT_ERROR_MESSAGE,
  };
};

export const errorHandler = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return errorBuilder(error.status as number, error.message);
  } else {
    return errorBuilder(undefined, undefined);
  }
};

export const publicApiService = axios.create({
  baseURL: DEFAULT_BASE_URL,
  timeout: DEFAULT_API_TIMEOUT,
});

export const authenticatedApiService = axios.create({
  baseURL: DEFAULT_BASE_URL,
  timeout: DEFAULT_API_TIMEOUT,
  withCredentials: true,
});
