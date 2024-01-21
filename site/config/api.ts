import axios from "axios";

export const nextapi = axios.create({
  baseURL: "http://localhost:3000",
});

export const fastapi = axios.create({
  baseURL: "http://localhost:8001",
});
