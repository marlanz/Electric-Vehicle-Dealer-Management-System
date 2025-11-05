import axios from "axios";
import { useCallback, useState } from "react";
import { ENDPOINTS } from "../constants";

interface Order {
  id: string;
  customerID: string;
  vehicleID: string;
  finalPrice: number;
  voucherID: string;
  staffID: string;
  status: string;
  createAt: string;
  note: string;
}

const useOrders = () => {
  const [odata, setOdata] = useState<Order[]>([]);
  const [odetail, setOdetail] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAllOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(ENDPOINTS.orders);
      setOdata(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderDetail = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${ENDPOINTS.orders}/${id}`);
      setOdetail(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);
  return { fetchAllOrders, fetchOrderDetail, odata, loading, odetail };
};

export default useOrders;
