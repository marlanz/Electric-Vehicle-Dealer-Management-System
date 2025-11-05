import axios from "axios";

// Single Base URL
const BASE_URL =
  "https://electric-vehicle-dealer-management.onrender.com/api/v1";

function createApiClient() {
  const api = axios.create({
    baseURL: BASE_URL,
  });

  // Request Interceptor
  api.interceptors.request.use(
    async (config) => {
      const storeUser = await getFromStorage<User>("authUser");
      if (storeUser?.token) {
        config.headers.Authorization = `Bearer ${storeUser.token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  return api;
}

// Export single unified API client
export const api = createApiClient();
