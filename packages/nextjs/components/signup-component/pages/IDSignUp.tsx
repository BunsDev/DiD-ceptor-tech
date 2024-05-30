import React from "react";
import InputField from "../InputField";
import Typography from "~~/components/signup-component/Typography";

interface IDSignUpProps {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
}

const IDSignUp: React.FC<IDSignUpProps> = ({ inputValue, setInputValue }) => {
  const handleInputChange = (value: string) => {
    setInputValue(value);
    localStorage.setItem("etheriumID", value); // Store input value in localStorage
  };

  return (
    <div className="justify-center flex flex-col h-screen items-center gap-10 lg:w-3/5">
      <Typography variant="title">Input your ID with Ethereum</Typography>
      <InputField type="text" label="Ethereum Address" value={inputValue} onChange={handleInputChange} />
    </div>
  );
};

export default IDSignUp;
