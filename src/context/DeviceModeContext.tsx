"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type DeviceMode = "desktop" | "mobile";

interface DeviceModeContextType {
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
}

const DeviceModeContext = createContext<DeviceModeContextType | undefined>(undefined);

export const DeviceModeProvider = ({ children }: { children: ReactNode }) => {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>(() => {
    // Initialize from localStorage or default to desktop
    const savedMode = localStorage.getItem("deviceMode") as DeviceMode | null;
    return savedMode || "desktop";
  });

  useEffect(() => {
    localStorage.setItem("deviceMode", deviceMode);
  }, [deviceMode]);

  return (
    <DeviceModeContext.Provider value={{ deviceMode, setDeviceMode }}>
      {children}
    </DeviceModeContext.Provider>
  );
};

export const useDeviceMode = () => {
  const context = useContext(DeviceModeContext);
  if (context === undefined) {
    throw new Error("useDeviceMode must be used within a DeviceModeProvider");
  }
  return context;
};