import { useState } from "react";
import { DESCRIPTION_LENGTH } from "../const/business";

const useExpandableDescription = (description: string) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isLongDescription = description.length > DESCRIPTION_LENGTH;

  const visibleDescription =
    isLongDescription && !isExpanded
      ? description.slice(0, DESCRIPTION_LENGTH)
      : description;

  return {
    visibleDescription,
    isLongDescription,
    isExpanded,
    expand: () => setIsExpanded(true),
  };
};

export default useExpandableDescription;
