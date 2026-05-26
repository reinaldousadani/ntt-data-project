import {
  authenticatedApiService,
  errorHandler,
  publicApiService,
} from "@/modules/core/services/api";

const ACCESS_TOKEN_EXPIRY = 30;
export const ACCESS_TOKEN_KEY = "access-token";
export const REFRESH_TOKEN_KEY = "refresh-token";

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
};

export type GetProfileResponse = {
  firstName: string;
  lastName: string;
  maidenName: string;
  email: string;
  image: string;
};

export function useAuthService() {
  const login = async ({ username, password }: LoginPayload) => {
    try {
      const res = await publicApiService.post<LoginResponse>("/auth/login", {
        username,
        password,
        expiresInMins: ACCESS_TOKEN_EXPIRY,
      });
      window.localStorage.setItem(ACCESS_TOKEN_KEY, res.data.accessToken);
      window.localStorage.setItem(REFRESH_TOKEN_KEY, res.data.refreshToken);
      return res.data;
    } catch (error) {
      throw errorHandler(error);
    }
  };

  const getProfile = async () => {
    const fetchFunc = async () => {
      const res = await authenticatedApiService.get<GetProfileResponse>(
        "/auth/me",
        {
          headers: {
            Authorization: `${window.localStorage.getItem(ACCESS_TOKEN_KEY)}`,
          },
        },
      );
      return res.data;
    };
    try {
      return await fetchFunc();
    } catch (error) {
      let errObj = errorHandler(error);
      if (errObj.status === 401) {
        try {
          await refreshAccessToken();
          return await fetchFunc();
        } catch (error) {
          throw errorHandler(error);
        }
      } else {
        throw errObj;
      }
    }
  };

  const refreshAccessToken = async () => {
    try {
      const res = await authenticatedApiService.post<
        Pick<LoginResponse, "accessToken" | "refreshToken">
      >("/auth/refresh", {
        refreshToken: `${window.localStorage.getItem(REFRESH_TOKEN_KEY)}`,
      });
      window.localStorage.setItem(ACCESS_TOKEN_KEY, res.data.accessToken);
      window.localStorage.setItem(REFRESH_TOKEN_KEY, res.data.refreshToken);
      return res.data;
    } catch (error) {
      throw errorHandler(error);
    }
  };

  return { login, getProfile, refreshAccessToken };
}
