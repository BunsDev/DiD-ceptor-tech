import React from "react";
import InputField from "../InputField";
import Typography from "~~/components/signup-component/Typography";

interface NameSignUpProps {
  inputName: string;
  setInputName: React.Dispatch<React.SetStateAction<string>>;
}

const NameSignUp: React.FC<NameSignUpProps> = ({ inputName, setInputName }) => {
  const labelStepName = "Full Name";
  const handleInputChange = (value: string) => {
    setInputName(value);
    localStorage.setItem(labelStepName, value); // Store input value in localStorage
  };

  return (
    <div className="justify-center flex flex-col h-screen items-center gap-10 lg:w-3/5">
      <Typography variant="title">Input your Name</Typography>
      <InputField type="text" label={labelStepName} value={inputName} onChange={handleInputChange} />
    </div>
  );
};

export default NameSignUp;
