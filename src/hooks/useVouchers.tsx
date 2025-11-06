import axios from "axios";
import { useCallback, useState } from "react";
import { ENDPOINTS } from "../constants";

export interface Vouchers {
  id: string;
  name: string;
  description: string;
  discountPercentage: number;
  qty: number;
}

interface UpdateVoucherProps {
  name?: string;
  description?: string;
  discountPercentage?: number;
  qty?: number;
}

const useVouchers = () => {
  const [vodata, setvodata] = useState<Vouchers[]>([]);
  const [vodetail, setvodetail] = useState<Vouchers | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAllVouchers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(ENDPOINTS.vouchers);
      setvodata(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVoucherDetail = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${ENDPOINTS.vouchers}/${id}`);
      setvodetail(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVoucher = useCallback(
    async (id: number, body: UpdateVoucherProps) => {
      setLoading(true);
      try {
        const response = await axios.put(`${ENDPOINTS.vouchers}/${id}`, body);
        if (response.status === 200) {
          return true;
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );
  return {
    fetchAllVouchers,
    fetchVoucherDetail,
    updateVoucher,
    vodata,
    loading,
    vodetail,
  };
};

export default useVouchers;
