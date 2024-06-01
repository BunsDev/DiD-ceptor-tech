import React, { useEffect } from "react";
import InputField from "../InputField";
import Typography from "~~/components/signup-component/Typography";

interface NameSignUpProps {
  inputName: string;
  setInputName: React.Dispatch<React.SetStateAction<string>>;
}

const NameSignUp: React.FC<NameSignUpProps> = ({ inputName, setInputName }) => {
  const labelStepName = "Full Name";
  useEffect(() => {
    const storedValue = localStorage.getItem(labelStepName);
    if (storedValue) {
      setInputName(storedValue);
    }
  }, [setInputName]);
  const handleInputChange = (value: string) => {
    setInputName(value);
    localStorage.setItem(labelStepName, value); // Store input value in localStorage
  };

  return (
    <div className="justify-center flex flex-col items-center gap-10">
      <Typography variant="title">What should we call you? (Your real, player or character name.)</Typography>
      <InputField type="text" label={labelStepName} value={inputName} onChange={handleInputChange} />
    </div>
  );
};

export default NameSignUp;
