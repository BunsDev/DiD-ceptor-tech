import * as React from "react";

interface SelectionDataProps {
  children: string;
  onClick: () => void;
}

const SelectionData: React.FC<SelectionDataProps> = ({ onClick, children }) => (
  <button
    className="px-10 py-2.5 bg-black border border-amber-200 border-solid rounded-[50px] max-md:px-5 text-xl hover:text-[18px]
    duration-300 ease-in-out"
    onClick={onClick}
  >
    {children}
  </button>
);

export default SelectionData;
