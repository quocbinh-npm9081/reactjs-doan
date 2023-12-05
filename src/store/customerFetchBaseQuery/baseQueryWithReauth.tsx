import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'
import queryString from 'query-string'

import { localToken } from '@/constant/constant'
import { FETCH_AUTH_ERROR, RefreshTokenResponse } from '@/types/auth/auth'

import { RootState } from '../store'

const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
  mode: 'cors',
  baseUrl: import.meta.env.VITE_API_END_POINT,
  prepareHeaders: (headers: Headers, { getState }) => {
    headers.set('Access-Control-Allow-Origin', '*')
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    } else if (headers.get('Content-Type') === 'multipart/form-data') {
      headers.delete('Content-Type')
    }
    const state = getState() as RootState
    if (state.auth?.accessToken) {
      headers.set('Authorization', `Bearer ${state.auth.accessToken}`)
    }
    return headers
  },
  paramsSerializer: (params: Record<string, unknown>) =>
    queryString.stringify(params, { arrayFormat: 'none' }),
})
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  await mutex.waitForUnlock()
  let result = await baseQuery(args, api, extraOptions)
  const auth = JSON.parse(String(localStorage.getItem(localToken)))

  if (
    (result.error && result.error.status === 401 && auth && auth.refreshToken) ||
    (result.error?.status === FETCH_AUTH_ERROR && auth && auth.refreshToken)
  ) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        const refreshTokenString: string = auth.refreshToken
        const refreshResult = await baseQuery(
          {
            url: 'auth/refresh-token',
            method: 'POST',
            body: { refreshToken: refreshTokenString },
          },
          api,
          extraOptions,
        )
        const data: RefreshTokenResponse = refreshResult.data as RefreshTokenResponse
        if (data) {
          api.dispatch({ type: 'auth/refreshTokenSuccess', payload: data })
          result = await baseQuery(args, api, extraOptions)
        } else {
          api.dispatch({ type: 'auth/signOut' })
        }
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }
  return result
}

export default baseQueryWithReauth
