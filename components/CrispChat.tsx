"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

const CripsChat = () => {
  useEffect(() => {
    Crisp.configure("1089af21-e22d-4887-a0cd-e7b6b936d534");
  }, []);

  return null;
};

export default CripsChat;
