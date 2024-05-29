import React from "react";
import Typography from "./Typography";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type: "text" | "email" | "password" | "textarea";
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, type }) => {
  if (type === "textarea") {
    return (
      <div className="flex flex-col w-full">
        <Typography variant="label" className="text-left">
          {label}
        </Typography>
        <textarea
          className="justify-center self-stretch p-3 
                               text-sm rounded-lg border border-solid 
                               border-neutral-400 text-neutral-400"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <Typography variant="label" className="text-left">
        {label}
      </Typography>
      <input
        type={type}
        className="justify-center self-stretch p-3 
                           text-sm rounded-lg border border-solid 
                           border-neutral-400 text-neutral-400"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
};

export default InputField;
