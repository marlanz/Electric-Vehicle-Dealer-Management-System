import axios from "axios";
import { useCallback, useState } from "react";
import { ENDPOINTS } from "../constants";

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
}

interface CreateCustomerProps {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
}

const useCustomer = () => {
  const [cdata, setCdata] = useState<Customer[]>([]);
  const [cdetail, setCdetail] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAllCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(ENDPOINTS.customers);
      setCdata(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCustomerDetail = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${ENDPOINTS.customers}/${id}`);
      setCdetail(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCustomer = useCallback(async (body: CreateCustomerProps) => {
    setLoading(true);
    try {
      const response = await axios.post(`${ENDPOINTS.customers}`, body);
      if (response.status === 201) return true;
      // setCdetail(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCustomer = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${ENDPOINTS.customers}/${id}`);
      if (response.status === 200) return true;
      // setCdetail(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    fetchAllCustomers,
    fetchCustomerDetail,
    createCustomer,
    deleteCustomer,
    cdata,
    loading,
    cdetail,
  };
};

export default useCustomer;
