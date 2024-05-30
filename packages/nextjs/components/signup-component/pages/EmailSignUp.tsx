import React from "react";
import InputField from "../InputField";
import Typography from "~~/components/signup-component/Typography";

interface EmailSignUpProps {
  inputEmail: string;
  setInputEmail: React.Dispatch<React.SetStateAction<string>>;
}

const EmailSignUp: React.FC<EmailSignUpProps> = ({ inputEmail, setInputEmail }) => {
  const labelStepName = "Email Address";
  const handleInputChange = (value: string) => {
    setInputEmail(value);
    localStorage.setItem(labelStepName, value); // Store input value in localStorage
  };

  return (
    <div className="justify-center flex flex-col h-screen items-center gap-10 lg:w-3/5">
      <Typography variant="title">Input your Email</Typography>
      <InputField type="email" label={labelStepName} value={inputEmail} onChange={handleInputChange} />
    </div>
  );
};

export default EmailSignUp;
