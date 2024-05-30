import React, { useEffect, useState } from "react";
import SelectionData from "../SelectionData";
import Typography from "~~/components/signup-component/Typography";

interface RoleSignUpProps {
  inputRole: string;
  setInputRole: React.Dispatch<React.SetStateAction<string>>;
}

const RoleSignUp: React.FC<RoleSignUpProps> = ({ inputRole, setInputRole }) => {
  const labelStepName = "User Role";
  const [selectedRole, setSelectedRole] = useState<string>("");

  useEffect(() => {
    if (selectedRole) {
      setInputRole(selectedRole);
      localStorage.setItem(labelStepName, selectedRole); // Save selected role to localStorage
    }
  }, [selectedRole, setInputRole]);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const races = [
    "Dragonborn",
    "Dwarf",
    "Elf",
    "Githyanki",
    "Gnome",
    "Goblin",
    "Half-Elf",
    "Halfling",
    "Half-Orc",
    "Human",
    "Tabaxi",
    "Thri-Kreen",
    "Tiefling",
    "Tortle",
    "Warforged",
  ];

  return (
    <div className="justify-center flex flex-col h-screen items-center gap-10 lg:w-3/5">
      <Typography variant="title">Choose your Role</Typography>
      <section className="flex flex-col px-5 text-center leading-[150%]">
        <h2 className="self-center text-base text-gray-200">Select One: {inputRole}</h2>
        <div className="flex flex-col flex-wrap justify-center items-center px-12 mt-5 w-full text-xl text-white whitespace-nowrap max-md:px-5 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-wrap">
            {races.slice(0, 6).map(race => (
              <SelectionData key={race} onClick={() => handleRoleSelect(race)}>
                {race}
              </SelectionData>
            ))}
          </div>
          <div className="flex gap-5 self-stretch mt-5 max-md:flex-wrap">
            {races.slice(6, 12).map(race => (
              <SelectionData key={race} onClick={() => handleRoleSelect(race)}>
                {race}
              </SelectionData>
            ))}
          </div>
          <div className="flex gap-5 mt-5 max-md:flex-wrap">
            {races.slice(12, 15).map(race => (
              <SelectionData key={race} onClick={() => handleRoleSelect(race)}>
                {race}
              </SelectionData>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoleSignUp;
