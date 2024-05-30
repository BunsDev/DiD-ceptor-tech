import * as React from "react";

interface TypographyProps {
  children: string;
  variant: "title" | "subtitle" | "desc" | "label";
  className?: string;
}

const Typography: React.FC<TypographyProps> = ({ children, variant, className = "" }) => {
  const baseStyles = "text-center";

  const titleStyles =
    "text-5xl text-white leading-[76.8px] max-md:mt-10 max-md:max-w-full max-md:text-4xl font-milonga";
  const subtitleStyles =
    "text-3xl text-gray-300 leading-[50px] max-md:mt-8 max-md:max-w-full max-md:text-2xl font-oswald";
  const descStyles = "text-base leading-6 text-gray-200 lg:w-[840px] max-md:mt-10 font-oswald";
  const labelStyles = "text-base leading-6 text-gray-400 font-oswald font-[400]";

  const variantStyles = {
    title: titleStyles,
    subtitle: subtitleStyles,
    desc: descStyles,
    label: labelStyles,
  };

  const combinedStyles = `${variant !== "label" ? baseStyles : ""} ${variantStyles[variant]} ${className}`;

  return <div className={combinedStyles}>{children}</div>;
};

export default Typography;
