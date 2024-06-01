import React, { useEffect, useState } from "react";
import SelectionData from "../SelectionData";
import Typography from "~~/components/signup-component/Typography";

interface InitiativeSignUpProps {
  inputInitiative: string;
  setInputInitiative: React.Dispatch<React.SetStateAction<string>>;
}

const InitiativeSignUp: React.FC<InitiativeSignUpProps> = ({ inputInitiative, setInputInitiative }) => {
  const labelStepName = "User Initiative";
  const storedValue = localStorage.getItem(labelStepName);
  const [selectedData, setSelectedData] = useState<string>(storedValue || "");

  useEffect(() => {
    if (selectedData) {
      setInputInitiative(selectedData);
      localStorage.setItem(labelStepName, selectedData); // Save selected project to localStorage
    }
  }, [selectedData, setInputInitiative]);

  const handleProjectSelect = (data: string) => {
    setSelectedData(data);
  };

  const dataSelections = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <Typography variant="title">Initiative Scale</Typography>
      <section className="flex flex-col items-center w-4/5 px-5 text-center leading-[150%] mx-auto">
        <h2 className="self-center text-base text-gray-200">Select One: {inputInitiative}</h2>
        <div className="flex flex-wrap justify-center w-full gap-5 my-5 text-xl text-white">
          {dataSelections.map(dataSelection => (
            <SelectionData
              key={dataSelection}
              selected={selectedData === dataSelection}
              onClick={() => handleProjectSelect(dataSelection)}
            >
              {dataSelection}
            </SelectionData>
          ))}
        </div>
      </section>
    </div>
  );
};

export default InitiativeSignUp;
