import { Icon } from "@iconify/react";

interface TechIconProps {
  icon: string;
  size?: number | string;
  className?: string;
}

export function TechIcon({
  icon,
  size = 40,
  className,
}: TechIconProps) {
  return (
    <Icon
      icon={icon}
      width={size}
      height={size}
      className={className}
    />
  );
}