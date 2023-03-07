import axios from "axios";
import { BASE_URL } from "../constants/index";
const baseUrl = BASE_URL;

//----------Get data----------//
export const getData = async (url) => {
  const accessToken = JSON.parse(localStorage.getItem("accessToken"));

  return await axios({
    method: "GET",
    url: `${baseUrl}/${url}`,
    headers: {
      Authorization: accessToken,
    },
  });
};

//----------Post data----------//
export const postData = async (url, post) => {
  const accessToken = JSON.parse(localStorage.getItem("accessToken"));

  return await axios({
    method: "POST",
    url: `${baseUrl}/${url}`,
    data: post,
    headers: {
      Authorization: accessToken,
    },
  });
};

//----------Patch data----------//
export const patchData = async (url, patch) => {
  const accessToken = JSON.parse(localStorage.getItem("accessToken"));

  console.log(patch);
  return await axios({
    method: "PATCH",
    url: `${baseUrl}/${url}`,
    data: patch,
    headers: {
      Authorization: accessToken,
    },
  });
};

//----------Put data----------//
export const putData = async (url, put) => {
  const accessToken = JSON.parse(localStorage.getItem("accessToken"));

  return await axios({
    method: "PUT",
    url: `${baseUrl}/${url}`,
    data: put,
    headers: {
      Authorization: accessToken,
    },
  });
};

//----------Delete data----------//
export const deleteData = async (url) => {
  const accessToken = JSON.parse(localStorage.getItem("accessToken"));
  return await axios({
    method: "DELETE",
    url: `${baseUrl}/${url}`,
    headers: {
      Authorization: accessToken,
    },
  });
};
//get Refresh token

axios.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    if (error?.response?.status !== 401) {
      return Promise.reject(error);
    }
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
      console.log("token expired:::");
      originalRequest._retry = true;
      const refreshToken = await JSON.parse(
        localStorage.getItem("refreshToken")
      );
      if (!refreshToken) {
        window.location.href = "/login";
        return Promise.reject(error);
      }
      if (refreshToken) {
        console.log("create new token:::");
        return axios
          .post(`${baseUrl}/user/refresh-token`, {
            refreshToken: refreshToken,
          })
          .then((res) => {
            if (res.status === 200) {
              const { accessToken, refreshToken } = res.data;
              localStorage.setItem("accessToken", JSON.stringify(accessToken));
              localStorage.setItem(
                "refreshToken",
                JSON.stringify(refreshToken)
              );
              console.log("sent req again::::");
              axios.defaults.headers.common["Authorization"] = accessToken;
              originalRequest.headers["Authorization"] = accessToken;
              return axios(originalRequest);
            }
          })
          .catch((err) => {
            localStorage.clear();
            window.location.href = "/login";
          });
      }
    }
    return Promise.reject(error);
  }
);
