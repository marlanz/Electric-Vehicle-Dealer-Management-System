import axios from "axios";
import { useCallback, useState } from "react";
import { ENDPOINTS } from "../constants";

interface Appointments {
  id: string;
  customerID: string;
  vehicleID: string;
  dealerLocation: string;
  appointedDate: string;
  staffName: string;
  status: string;
  note: string;
}

const useAppointments = () => {
  const [adata, setAdata] = useState<Appointments[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(ENDPOINTS.appointments);
      setAdata(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);
  return { fetchAllAppointments, adata, loading };
};

export default useAppointments;
