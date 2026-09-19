"use client";
import { setUserData } from "@/redux/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import axiosClient from "@/lib/axiosClient";

function useGetMe(enabled: boolean) {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !enabled) return;

    const fetchUser = async () => {
      try {
        const { data } = await axiosClient.get("/api/user/me");
        dispatch(setUserData(data));
      } catch (error) {
        // Fallback to session data if the API call fails
        if (session?.user) {
          dispatch(setUserData(session.user));
        }
      }
    };

    fetchUser();
  }, [enabled, session, dispatch, mounted]);
}

export default useGetMe;
