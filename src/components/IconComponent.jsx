import React from "react";
import { getIconComponent } from "../utils/icons";

const IconComponent = ({ name, className = "w-5 h-5", size, strokeWidth = 2 }) => {
  const Icon = getIconComponent(name);
  return <Icon className={className} size={size} strokeWidth={strokeWidth} />;
};

export default IconComponent;
