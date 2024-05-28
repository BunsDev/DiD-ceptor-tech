import * as React from "react";

interface TypographyProps {
  text: string;
  variant: "title" | "desc";
  className?: string;
}

const Typography: React.FC<TypographyProps> = ({ text, variant, className = "" }) => {
  const baseStyles = "text-center";

  const titleStyles =
    "text-5xl text-white leading-[76.8px] max-md:mt-10 max-md:max-w-full max-md:text-4xl font-milonga";
  const descStyles = "text-base leading-6 text-gray-200 lg:w-[840px] max-md:mt-10 font-oswald";

  const combinedStyles = `${baseStyles} ${variant === "title" ? titleStyles : descStyles} ${className}`;

  return <div className={combinedStyles}>{text}</div>;
};

export default Typography;
