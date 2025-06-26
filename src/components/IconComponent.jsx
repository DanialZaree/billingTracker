import { ICONS } from "../utils/icons";

const IconComponent = ({ name }) => {
  return ICONS[name] || ICONS.DollarSign;
};

export default IconComponent;
