import * as React from "react";

type CircleProps = {
  isFilled: boolean;
  onClick?: () => void;
};

const Circle: React.FC<CircleProps> = ({ isFilled, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer shrink-0 h-[25px] w-[25px] rounded-full border border-solid ${
        isFilled ? "bg-amber-400 border-black" : "bg-black border-amber-400"
      }`}
    />
  );
};

export default Circle;
