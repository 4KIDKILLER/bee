import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ShadcnUI/tooltip";

export function BeeTootip({
  content,
  children,
}: {
  content: string;
  children: React.ReactNode;
}) {
  return (
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
  );
}
