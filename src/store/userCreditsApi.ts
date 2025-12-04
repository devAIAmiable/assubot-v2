import { config } from '../config/env';
import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithAuth } from '../utils/baseQueryWithAuth';

interface CreditsApiResponse {
  status?: string;
  message?: string;
  data?: {
    balance: number;
  };
  balance?: number;
}

export const userCreditsApi = createApi({
  reducerPath: 'userCreditsApi',
  baseQuery: createBaseQueryWithAuth({
    baseUrl: config.coreApiUrl,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getUserCredits: builder.query<number, void>({
      query: () => '/users/credits',
      transformResponse: (response: CreditsApiResponse): number => {
        if (typeof response.balance === 'number') {
          return response.balance;
        }
        if (response.data && typeof response.data.balance === 'number') {
          return response.data.balance;
        }
        return 0;
      },
    }),
  }),
});

export const { useLazyGetUserCreditsQuery, useGetUserCreditsQuery } = userCreditsApi;
