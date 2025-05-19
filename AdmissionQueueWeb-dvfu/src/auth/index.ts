import { createAuth } from 'vue-auth3';
import { defineAuthDriver } from 'vue-auth3/dist/chunk-QALVUXMO.mjs';
import { defineHttpDriver } from 'vue-auth3/dist/chunk-3BTIPVYA.mjs';
import router from '@/router';
import { APIAxios } from '@/axios';

const axiosDriver = defineHttpDriver({
  request: APIAxios
});

const authDriver = defineAuthDriver({
  request(auth: any, options: any, token: any) {
    options.headers['Authorization'] = 'Bearer ' + token;

    return options;
  },

  response(auth: any, res: any) {
    const token = res.data.auth_token;

    if (token) {
      const i = token.split(/Bearer:?\s?/i);

      return i[i.length > 1 ? 1 : 0].trim();
    }

    return null;
  }
});
const auth = createAuth({
  rolesKey: 'groups',
  tokenDefaultKey: 'auth_token',
  forbiddenRedirect: '/403',
  loginData: {
    url: '/auth/token/login',
    method: 'POST',
    redirect: '/',
    fetchUser: false,
    staySignedIn: true,
    remember: true
  },
  logoutData: {
    url: '/auth/token/logout',
    method: 'POST',
    redirect: '/',
    makeRequest: true
  },
  refreshToken: {
    enabled: false
  },
  fetchData: {
    url: 'account/user/',
    method: 'GET'
  },
  plugins: {
    router
  },
  drivers: {
    auth: authDriver,
    http: axiosDriver
  }
});

export default auth;
