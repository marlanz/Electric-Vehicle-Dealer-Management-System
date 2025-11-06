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

interface CreateQuotationProps {
  customerID: string;
  vehicleID: string;
  finalPrice: number;
  voucherID: string | null;
  staffID: string | null;
  status: string;
  createAt: string;
  note: string;
}

export interface UpdateQuotationProps {
  status: string;
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

  const fetchQuotationDetail = useCallback(async (id: number) => {
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

  const createQuotations = useCallback(async (body: CreateQuotationProps) => {
    setLoading(true);
    try {
      const response = await axios.post(ENDPOINTS.quotations, body); // ✅ sửa endpoint
      if (response.status === 201) {
        return true;
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuotation = useCallback(
    async (id: number, body: UpdateQuotationProps) => {
      setLoading(true);
      try {
        const response = await axios.put(`${ENDPOINTS.quotations}/${id}`, body);
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
    fetchAllQuotations,
    fetchQuotationDetail,
    createQuotations,
    updateQuotation,
    qdata,
    loading,
    qdetail,
  };
};

export default useQuotations;
