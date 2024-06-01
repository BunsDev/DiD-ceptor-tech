import React, { useEffect, useState } from "react";
import SelectionData from "../SelectionData";
import Typography from "~~/components/signup-component/Typography";

interface RoleSignUpProps {
  inputRole: string;
  setInputRole: React.Dispatch<React.SetStateAction<string>>;
}

const RoleSignUp: React.FC<RoleSignUpProps> = ({ inputRole, setInputRole }) => {
  const labelStepName = "User Role";
  const storedValue = localStorage.getItem(labelStepName);
  const [selectedRole, setSelectedRole] = useState<string>(storedValue || "");

  useEffect(() => {
    if (selectedRole) {
      setInputRole(selectedRole);
      localStorage.setItem(labelStepName, selectedRole); // Save selected role to localStorage
    }
  }, [selectedRole, setInputRole]);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const dataSelections = ["Volunteer", "Contributor", "Brand Ambassador", "Staff", "Investor", "Artist", "Other"];

  return (
    <div className="justify-center flex flex-col items-center gap-10">
      <Typography variant="title">Choose your Role</Typography>
      <section className="flex flex-col px-5 text-center leading-[150%]">
        <h2 className="self-center text-base text-gray-200">Select One: {inputRole}</h2>
        <div className="flex flex-wrap justify-center w-full gap-5 my-5 text-xl text-white">
          {dataSelections.map(dataSelection => (
            <SelectionData
              key={dataSelection}
              selected={selectedRole === dataSelection}
              onClick={() => handleRoleSelect(dataSelection)}
            >
              {dataSelection}
            </SelectionData>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RoleSignUp;
