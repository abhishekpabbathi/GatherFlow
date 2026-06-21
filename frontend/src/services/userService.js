import axios from "axios";

const API = axios.create({
  baseURL: "https://gatherflow-backend.onrender.com",
  timeout: 10000
});

export const registerUser = async (formData) => {
  const res = await API.post("/register", formData);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await API.get("/all");
  return Array.isArray(res.data) ? res.data : [];
};

export const checkDuplicate = async ({ phone, email }) => {
  const res = await API.post("/check-duplicate", { phone, email });
  return res.data;
};