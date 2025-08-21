import axios from 'axios';
import { TokenRepository } from './auth/tokenRepositoryInterface';

export const createClient = ({
  tokenRepository,
}: {
  tokenRepository: TokenRepository;
}) => {
  const client = axios.create({
    baseURL: import.meta.env.VITE_APP_SERVER_PATH,
  });

  //let refreshRequest: AxiosPromise | null = null;

  client.interceptors.request.use((config: any) => {
    const accessToken = tokenRepository.getAccessToken();

    if (!accessToken) {
      return config;
    }

    const newConfig = {
      ...config,
      headers: {},
    };

    newConfig.headers.Authorization = `Bearer ${accessToken}`;

    return newConfig;
  });

  // client.interceptors.response.use(
  //   (value) => value,
  //   async (error) => {
  //     if (!error.response || !error.config) {
  //       throw error;
  //     }

  //     if (error.response.status !== RESPONSE_STATUS_401) {
  //       throw error;
  //     }

  //     const response: any = await refreshRequest;
  //     tokenRepository.setAccessToken(response.data.accessToken);

  //     const newRequest = {
  //       ...error.config,
  //       headers: {
  //         Authorization: `Bearer ${response.data.identityToken}`,
  //       },
  //       retry: true,
  //     };

  //     return client(newRequest);
  //   },
  // );

  return client;
};
