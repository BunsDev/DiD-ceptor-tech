import React, { useEffect } from "react";
import InputField from "../InputField";
import Typography from "~~/components/signup-component/Typography";

interface EmailSignUpProps {
  inputEmail: string;
  setInputEmail: React.Dispatch<React.SetStateAction<string>>;
}

const EmailSignUp: React.FC<EmailSignUpProps> = ({ inputEmail, setInputEmail }) => {
  const labelStepName = "Email Address";
  useEffect(() => {
    const storedValue = localStorage.getItem(labelStepName);
    if (storedValue) {
      setInputEmail(storedValue);
    }
  }, [setInputEmail]);
  const handleInputChange = (value: string) => {
    setInputEmail(value);
    localStorage.setItem(labelStepName, value); // Store input value in localStorage
  };

  return (
    <div className="justify-center flex flex-col items-center gap-10">
      <Typography variant="title">Ceptor wants your email so we can invite you to join us</Typography>
      <InputField type="email" label={labelStepName} value={inputEmail} onChange={handleInputChange} />
    </div>
  );
};

export default EmailSignUp;
