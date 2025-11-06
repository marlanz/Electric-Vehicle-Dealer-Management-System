import axios from "axios";
import { useCallback, useState } from "react";
import { selectAuth } from "../features/auth/authSlice";
import { useAppSelector } from "../store";

interface Dealer {
  id: string;
  code: string;
  name: string;
  region_id: string;
  address: string;
  contact_email: string;
  contact_phone: string;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: "DEALER_STAFF" | "DEALER_MANAGER" | "ADMIN";
  dealer_id: string;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
  updated_at: string;
  dealers: Dealer;
  dealer_name: string;
  dealer_code: string;
}

const useProfile = () => {
  const { token } = useAppSelector(selectAuth);

  const [data, setData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  const getProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<Profile>(
        "https://electric-vehicle-dealer-management.onrender.com/api/v1/auth/profile",
        {
          headers: {
            accept: "application/json",
            Authorization: `${token}`,
          },
        }
      );

      setData(res.data);
      return res.data;
    } catch (err) {
      console.log("❌ Error fetching profile:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return { data, loading, getProfile };
};

export default useProfile;
