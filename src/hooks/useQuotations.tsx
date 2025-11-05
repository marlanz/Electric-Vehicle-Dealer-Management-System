import axios from "axios";
import { useCallback, useState } from "react";
import { ENDPOINTS } from "../constants";

interface Quotation {
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

const useQuotations = () => {
  const [qdata, setQdata] = useState<Quotation[]>([]);
  const [qdetail, setQdetail] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAllQuotations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(ENDPOINTS.quotations);
      setQdata(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQuotationDetail = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${ENDPOINTS.quotations}/${id}`);
      setQdetail(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);
  return { fetchAllQuotations, fetchQuotationDetail, qdata, loading, qdetail };
};

export default useQuotations;
