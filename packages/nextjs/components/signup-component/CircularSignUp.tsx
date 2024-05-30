import * as React from "react";

type CircleProps = {
  isFilled: boolean;
  tooltip?: string;
  onClick?: () => void;
};

const Circle: React.FC<CircleProps> = ({ isFilled, onClick, tooltip }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer shrink-0 h-[25px] w-[25px] rounded-full border border-solid tooltip ${
        isFilled ? "bg-amber-400 border-black" : "bg-black border-amber-400"
      }`}
      data-tip={tooltip}
    />
  );
};

export default Circle;
