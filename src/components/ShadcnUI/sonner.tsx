"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      richColors
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "#052e16",
          "--success-border": "#16a34a",
          "--success-text": "#22c55e",
          "--info-bg": "#082f49",
          "--info-border": "#409eff",
          "--info-text": "var(--theme-color)",
          "--warning-bg": "#451a03",
          "--warning-border": "#f59e0b",
          "--warning-text": "#f59e0b",
          "--error-bg": "#450a0a",
          "--error-border": "#ef4444",
          "--error-text": "#ef4444",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
          loading:
            "border-[#409eff] bg-[#082f49] text-(--theme-color)",
          loader: "text-(--theme-color)",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
