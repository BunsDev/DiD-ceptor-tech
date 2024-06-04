import * as React from "react";

interface ButtonProps {
  className?: string;
  variant?: "fill" | "outline";
  onClick?: () => void;
}

const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  children,
  onClick,
  className = "",
  variant = "fill",
}) => {
  const baseStyles =
    "text-center h-[62px] flex justify-center items-center border-2 border-solid rounded-[36.5px] duration-300 ease-in-out md:text-2xl md:hover:text-[22px] text-xl hover:text-base font-oswald";

  const fillStyles = "bg-amber-400 hover:bg-amber-300 text-black border-black";
  const outlineStyles = "bg-transparent text-white border-amber-400 hover:border-amber-300";

  const combinedStyles = `${baseStyles} ${variant === "fill" ? fillStyles : outlineStyles} ${className}`;

  return (
    <button onClick={onClick} className={combinedStyles}>
      {children}
    </button>
  );
};

export default Button;
