import * as React from "react";

interface SelectionDataProps {
  children: string;
  onClick: () => void;
  selected?: boolean;
}

const SelectionData: React.FC<SelectionDataProps> = ({ onClick, children, selected }) => {
  const baseStyles =
    "px-10 py-2.5 border border-amber-200 border-solid rounded-[50px] max-md:px-5 text-xl hover:text-[18px] duration-300 ease-in-out";

  const inactiveStyles = "bg-black";
  const activeStyles = "bg-amber-200 text-black";

  const variant = selected ? "active" : "inactive";
  const variantStyles = {
    active: activeStyles,
    inactive: inactiveStyles,
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default SelectionData;
