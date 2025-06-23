import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

type Child = {
  id: number;
  name: string;
  age: number;
  gender: Gender;
  className: string;
};

type ProfileCompletion = {
  percentage: number;
  missingFields: string[];
};

type User = {
  id: number;
  fullName: string;
  username: string;
  phoneNumber: string;
  email: string;
  role: string;
  isVerified: boolean;
  avatar: string;
  profileCompletion: ProfileCompletion;
  children: Child[];
};

type AuthStore = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  fetchUser: () => Promise<void>;
  setProfileCompletion: (profileCompletion: ProfileCompletion) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...user } : user,
        })),

      clearUser: () => set({ user: null }),

      fetchUser: async () => {
        try {
          const res = await axios.get("/api/me", {
            method: "GET",
            withCredentials: true,
          });

          if (!res.data.user) {
            set({ user: null });
            return;
          }

          set({ user: res.data.user });
        } catch (error) {
           if(axios.isAxiosError(error) && error.response && error.response.status === 404){
            set({ user: null });
           }
           else{
            console.error("Error in fetchUser:", error);
            set({ user: null });
           }
        }
      },

      setProfileCompletion: (profileCompletion) =>
        set((state) => ({
          user: state.user ? { ...state.user, profileCompletion } : null,
        })),
    }),
    {
      name: "auth",
    }
  )
);
