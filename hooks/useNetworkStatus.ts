"use client";
import { useEffect, useState } from "react";

const useNetworkStatus = (): "online" | "offline" => {
  const [status, setStatus] = useState<"online" | "offline">(
    navigator.onLine ? "online" : "offline"
  );

  const updateNetworkStatus = () => {
    setStatus(navigator.onLine ? "online" : "offline");
  };

  useEffect(() => {
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
  }, []);

  return status;
};

export default useNetworkStatus;
