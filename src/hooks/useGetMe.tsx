"use client";
import { setUserData } from "@/redux/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";

function useGetMe(enabled: boolean) {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !enabled || !session?.user) return;

    // Dispatch session user data to Redux
    dispatch(setUserData(session.user));
  }, [enabled, session, dispatch, mounted]);
}

export default useGetMe;
