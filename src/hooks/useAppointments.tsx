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

export interface CreateAppointmentProps {
  customerID?: string;
  vehicleID?: string;
  dealerLocation?: string;
  appointedDate?: string;
  staffName?: string;
  status?: string;
  note?: string;
  isQuote: boolean;
}

export interface UpdateAppointmentProps {
  status: string;
  note: string;
}

const useAppointments = () => {
  const [adata, setAdata] = useState<Appointments[]>([]);
  const [adetail, setAdetail] = useState<Appointments | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");

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

  const fetchAppointmentDetail = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`${ENDPOINTS.appointments}/${id}`);
      setAdetail(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAppointment = useCallback(
    async (id: number, body: UpdateAppointmentProps) => {
      setLoading(true);
      try {
        const response = await axios.put(
          `${ENDPOINTS.appointments}/${id}`,
          body
        );
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

  const createAppointment = useCallback(
    async (body: CreateAppointmentProps) => {
      setLoading(true);
      try {
        const response = await axios.post(ENDPOINTS.appointments, body);
        if (response.status === 201) {
          setMsg("Create appointment successfully");
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
    fetchAllAppointments,
    createAppointment,
    fetchAppointmentDetail,
    updateAppointment,
    adata,
    adetail,
    loading,
    msg,
  };
};

export default useAppointments;
