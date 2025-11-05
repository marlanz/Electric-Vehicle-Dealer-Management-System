import axios from "axios";
import { useCallback, useState } from "react";
import { ENDPOINTS } from "../constants";

interface Vehicles {
  id: string;
  model: string;
  version: string;
  color: string;
  year: string;
  manufacturedPrice: number;
  dealerPrice: number;
  description: string;
  imageURL: string;
  features: VehicleFeatures;
}

interface VehicleFeatures {
  motor: string;
  seats: number;
  battery: string;
  drivetrain: string;
}
const useVehicles = () => {
  const [vdata, setVdata] = useState<{ list: Vehicles[]; count: number }>({
    list: [],
    count: 0,
  });
  const [vdetail, setVdetail] = useState<Vehicles | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAllVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(ENDPOINTS.vehicles);
      setVdata({
        list: response.data.items,
        count: response.data.count,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVehicleDetail = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${ENDPOINTS.vehicles}/${id}`);
      setVdetail(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);
  return { fetchAllVehicles, fetchVehicleDetail, vdetail, vdata, loading };
};

export default useVehicles;
