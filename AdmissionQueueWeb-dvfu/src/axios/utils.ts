import type { AxiosError, AxiosResponse } from 'axios';
import APIAxios from './instance';
import type { Auth } from 'vue-auth3';

export function getAPIData(
  url: string,
  auth: Auth,
  func: (r: AxiosResponse) => void,
  error_func: (r: AxiosError) => void = () => {},
  params: any = {}
) {
  APIAxios.get(url, {
    headers: { Authorization: 'Bearer ' + auth.token() },
    params: params
  })
    .catch(error_func)
    .then((response) => {
      if (response === undefined) return;
      func(response);
    });
}

export function putAPIData(url: string, data: any, auth: Auth, func: (r: AxiosResponse) => void) {
  APIAxios.put(url, data, {
    headers: { Authorization: 'Bearer ' + auth.token() }
  })
    .catch((err) => {
      console.error(err);
    })
    .then((response) => {
      if (response === undefined) return;
      func(response);
    });
}
export function patchAPIData(url: string, data: any, auth: Auth, func: (r: AxiosResponse) => void) {
  APIAxios.patch(url, data, {
    headers: { Authorization: 'Bearer ' + auth.token() }
  })
    .catch((err) => {
      console.error(err);
    })
    .then((response) => {
      if (response === undefined) return;
      func(response);
    });
}
export function postAPIData(
  url: string,
  data: Object = {},
  auth: Auth,
  func: (r: AxiosResponse) => void = () => {},
  error_func: (r: AxiosError) => void = () => {},
  params: any = {}
) {
  APIAxios.post(url, data, {
    headers: { Authorization: 'Bearer ' + auth.token() },
    params: params
  })
    .catch(error_func)
    .then((response) => {
      if (response === undefined) return;
      func(response);
    });
}
