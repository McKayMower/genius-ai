"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

const CripsChat = () => {
  useEffect(() => {
    Crisp.configure("976a2527-e8db-470a-9882-bc37aba783e6");
  }, []);

  return null;
};

export default CripsChat;
