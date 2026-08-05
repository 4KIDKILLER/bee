import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ShadcnUI/tooltip";

export function BeeTootip({
  side,
  content,
  children,
}: {
  content: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{content}</TooltipContent>
    </Tooltip>
  );
}
