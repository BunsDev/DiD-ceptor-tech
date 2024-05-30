import * as React from "react";

interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <button
      className="flex gap-3 self-start text-xl leading-8 text-center text-white whitespace-nowrap cursor-pointer"
      onClick={onClick}
    >
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/ea354ca918946ba706fe71510d8cb902d1e0817eba8d20f05876ddd99c6ed8dd?apiKey=527f3bea2d00438bb4c1fee76d176b0f&"
        className="shrink-0 aspect-square fill-white w-[30px]"
        alt="Back Icon"
      />
      <div className="my-auto">Back</div>
    </button>
  );
};

export default BackButton;
