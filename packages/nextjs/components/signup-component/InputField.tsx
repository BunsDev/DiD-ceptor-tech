import React, { useEffect, useState } from "react";
import Typography from "./Typography";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type: "text" | "email" | "password" | "textarea";
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, type }) => {
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValidEmail(emailRegex.test(value));
    }
  }, [value, type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  const inputClasses =
    "justify-center self-stretch p-3 text-sm rounded-lg border border-solid border-neutral-400 text-neutral-400";

  return (
    <div className="flex flex-col w-full">
      <Typography variant="label" className="text-left">
        {label}
      </Typography>
      {type === "textarea" ? (
        <textarea className={inputClasses} value={value} onChange={handleChange} />
      ) : (
        <input type={type} className={inputClasses} value={value} onChange={handleChange} />
      )}
      {type === "email" && hasInteracted && !isValidEmail && (
        <Typography variant="label" className="text-red-400">
          Please enter a valid email address.
        </Typography>
      )}
    </div>
  );
};

export default InputField;
