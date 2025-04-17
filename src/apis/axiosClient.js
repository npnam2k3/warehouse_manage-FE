import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const originalRequest = error.config;
    if (error.response.status === 423) {
      return Promise.reject(error);
    }
    const token = localStorage.getItem("accessToken");
    if (error.response.status === 401 && token && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          "http://localhost:5000/auth/refreshToken",
          null,
          {
            withCredentials: true,
          }
        );
        const newAccessToken = res.data.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Gắn token mới vào request gốc
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Gửi lại request gốc
        return axiosClient(originalRequest);
      } catch (err) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
