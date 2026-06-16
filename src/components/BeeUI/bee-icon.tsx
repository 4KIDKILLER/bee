import React from "react";

const svgModules = import.meta.glob("../../assets/svg/*.svg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const svgMap = Object.fromEntries(
  Object.entries(svgModules).map(([path, url]) => {
    const name = path.split("/").pop()?.replace(/\.svg$/, "") ?? path;
    return [name, url];
  }),
) as Record<string, string>;

export interface BeeIconProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  name: string;
  size?: number | string;
}

export function BeeIcon({
  name,
  size = 20,
  alt,
  style,
  ...props
}: BeeIconProps) {
  const iconSrc = svgMap[name];

  if (!iconSrc) {
    console.warn(`[BeeIcon] 未找到名为 "${name}" 的 svg 资源`);
    return null;
  }

  return (
    <img
      src={iconSrc}
      alt={alt ?? name}
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        ...style,
      }}
      {...props}
    />
  );
}

export default BeeIcon;
