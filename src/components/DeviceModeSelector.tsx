"use client";

import React from "react";
import { useDeviceMode } from "@/context/DeviceModeContext";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function DeviceModeSelector() {
  const { deviceMode, setDeviceMode } = useDeviceMode();

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={deviceMode === "desktop" ? "default" : "ghost"}
            size="icon"
            onClick={() => setDeviceMode("desktop")}
            aria-label="Switch to Desktop View"
          >
            <Monitor className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Desktop View</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={deviceMode === "mobile" ? "default" : "ghost"}
            size="icon"
            onClick={() => setDeviceMode("mobile")}
            aria-label="Switch to Mobile View"
          >
            <Smartphone className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Mobile View</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}