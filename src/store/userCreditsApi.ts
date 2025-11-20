import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { config } from '../config/env';

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
  baseQuery: fetchBaseQuery({
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
