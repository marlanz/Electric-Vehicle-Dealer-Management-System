import avt_placeholder from "../../assets/images/avtplaceholder.jpg";
// import { ENDPOINTS } from "../api/constants";

export const color = {
  backgroundPrimary: "#101922",
  iconColor: "#1075D8",
  textSecondary: "#959CA7",
};

export const images = {
  avt_placeholder,
};

const BASE_URL = process.env.EXPO_PUBLIC_MOCKAPI;

export const ENDPOINTS = {
  vehicles: `${BASE_URL}/vehicles`,
  appointments: `${BASE_URL}/appointments`,
  customers: `${BASE_URL}/customers`,
  quotations: `${BASE_URL}/quotations`,
  orders: `${BASE_URL}/orders`,
};
