import React, { useEffect, useState } from "react";
import SelectionData from "../SelectionData";
import Typography from "~~/components/signup-component/Typography";

interface ProjectSignUpProps {
  inputProject: string;
  setInputProject: React.Dispatch<React.SetStateAction<string>>;
}

const ProjectSignUp: React.FC<ProjectSignUpProps> = ({ inputProject, setInputProject }) => {
  const labelStepName = "User Project";
  const storedValue = localStorage.getItem(labelStepName);
  const [selectedProject, setSelectedProject] = useState<string>(storedValue || "");

  useEffect(() => {
    if (selectedProject) {
      setInputProject(selectedProject);
      localStorage.setItem(labelStepName, selectedProject); // Save selected project to localStorage
    }
  }, [selectedProject, setInputProject]);

  const handleProjectSelect = (project: string) => {
    setSelectedProject(project);
  };

  const dataSelections = [
    "AI Development",
    "Art",
    "Backend / Smart Contracts",
    "Design",
    "Front End Development",
    "Gamification",
    "Growth Marketing",
    "Monetization",
    "Operations",
    "Product",
    "Project Management",
    "Social Media",
    "Wordpress Backend",
    "Other",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen pb-2 gap-10">
      <Typography variant="title">Choose Project You Are Interested In</Typography>
      <section className="flex flex-col items-center w-4/5 px-5 text-center leading-[150%] mx-auto">
        <h2 className="self-center text-base text-gray-200">Select One: {inputProject}</h2>
        <div className="flex flex-wrap justify-center w-full gap-5 my-5 text-xl text-white h-96 md:h-[450px] lg:h-auto overflow-y-auto">
          {dataSelections.map(dataSelection => (
            <SelectionData
              key={dataSelection}
              selected={selectedProject === dataSelection}
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

export default ProjectSignUp;
