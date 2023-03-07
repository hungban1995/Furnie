import axios from "axios";
import { BASE_URL } from "../constants/index.js";
const baseUrl = BASE_URL;

//----------Get data----------//
export const getData = async (url, accessToken) => {
  return axios({
    method: "GET",
    url: `${baseUrl}/${url}`,
    headers: {
      Authorization: accessToken,
    },
  });
};

//----------Post data----------//
export const postData = async (url, post, accessToken) => {
  return axios({
    method: "POST",
    url: `${baseUrl}/${url}`,
    data: post,
    headers: {
      Authorization: accessToken,
    },
  });
};

//----------Patch data----------//
export const patchData = async (url, patch, accessToken) => {
  return axios({
    method: "PATCH",
    url: `${baseUrl}/${url}`,
    data: patch,
    headers: {
      Authorization: accessToken,
    },
  });
};

//----------Put data----------//
export const putData = async (url, put, accessToken) => {
  return axios({
    method: "PUT",
    url: `${baseUrl}/${url}`,
    data: put,
    headers: {
      Authorization: accessToken,
    },
  });
};

//----------Delete data----------//
export const deleteData = async (url, accessToken) => {
  return axios({
    method: "DELETE",
    url: `${baseUrl}/${url}`,
    headers: {
      Authorization: accessToken,
    },
  });
};
