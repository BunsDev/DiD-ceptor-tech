import * as React from "react";

interface ButtonProps {
  text: string;
  className?: string;
  variant?: "fill" | "outline";
}

const Button: React.FC<ButtonProps> = ({ text, className = "", variant = "fill" }) => {
  const baseStyles =
    "text-center h-[62px] flex justify-center items-center border-2 border-solid rounded-[36.5px] duration-300 ease-in-out md:text-2xl text-xl";

  const fillStyles = "bg-amber-400 hover:bg-amber-300 text-black border-black";
  const outlineStyles = "bg-transparent text-white border-amber-400 hover:border-amber-300";

  const combinedStyles = `${baseStyles} ${variant === "fill" ? fillStyles : outlineStyles} ${className}`;

  return <button className={combinedStyles}>{text}</button>;
};

export default Button;
