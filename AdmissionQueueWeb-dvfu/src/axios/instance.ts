import axios, { AxiosError, type AxiosResponse } from 'axios';
import { getCurrentInstance } from 'vue';

const APIAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});
APIAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.code == 'ERR_NETWORK') {
      const $buefy = getCurrentInstance()?.appContext.config.globalProperties.$buefy;
      $buefy.notification.open({
        message: `Ошибка сети. Попробуйте ещё раз или сообщите администратору`,
        duration: 3000,
        type: 'is-danger',
        pauseOnHover: true
      });
    }
    return Promise.reject(error);
  }
);
export default APIAxios;
