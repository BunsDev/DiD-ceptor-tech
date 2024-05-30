import React, { useEffect, useState } from "react";
import SelectionData from "../SelectionData";
import Typography from "~~/components/signup-component/Typography";

interface InDiscordSignUpProps {
  inputInDiscord: string;
  setInputInDiscord: React.Dispatch<React.SetStateAction<string>>;
}

const InDiscordSignUp: React.FC<InDiscordSignUpProps> = ({ inputInDiscord, setInputInDiscord }) => {
  const labelStepName = "User InDiscord";
  const [selectedData, setSelectedData] = useState<string>("");

  useEffect(() => {
    if (selectedData) {
      setInputInDiscord(selectedData);
      localStorage.setItem(labelStepName, selectedData); // Save selected project to localStorage
    }
  }, [selectedData, setInputInDiscord]);

  const handleProjectSelect = (data: string) => {
    setSelectedData(data);
  };

  const dataSelections = ["Yup", "Nope", "The What?"];

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-10">
      <Typography variant="title">Are you already in the Ceptor Club Discord?</Typography>
      <section className="flex flex-col items-center w-4/5 px-5 text-center leading-[150%] mx-auto">
        <h2 className="self-center text-base text-gray-200">Select One: {inputInDiscord}</h2>
        <div className="flex flex-wrap justify-center w-full gap-5 my-5 text-xl text-white">
          {dataSelections.map(dataSelection => (
            <SelectionData key={dataSelection} onClick={() => handleProjectSelect(dataSelection)}>
              {dataSelection}
            </SelectionData>
          ))}
        </div>
      </section>
    </div>
  );
};

export default InDiscordSignUp;
