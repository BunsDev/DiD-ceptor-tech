import React, { useEffect, useState } from "react";
import SelectionData from "../SelectionData";
import Typography from "~~/components/signup-component/Typography";

interface ProjectSignUpProps {
  inputProject: string[];
  setInputProject: React.Dispatch<React.SetStateAction<string[]>>;
}

const ProjectSignUp: React.FC<ProjectSignUpProps> = ({ inputProject, setInputProject }) => {
  const labelStepName = "UserProject";
  const storedValue = localStorage.getItem(labelStepName);
  const [selectedProjects, setSelectedProjects] = useState<string[]>(storedValue ? JSON.parse(storedValue) : []);

  useEffect(() => {
    if (selectedProjects.length > 0) {
      setInputProject(selectedProjects);
      localStorage.setItem(labelStepName, JSON.stringify(selectedProjects)); // Save selected projects as JSON string
    }
  }, [selectedProjects, setInputProject]);

  const handleProjectSelect = (project: string) => {
    const index = selectedProjects.indexOf(project);
    if (index === -1) {
      setSelectedProjects([...selectedProjects, project]); // Add the project if not already selected
    } else {
      const updatedProjects = selectedProjects.filter(selectedProject => selectedProject !== project); // Remove the project if already selected
      setSelectedProjects(updatedProjects);
    }
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
    <>
      <Typography variant="title">Choose Projects You Are Interested In</Typography>
      <section className="flex-col items-center px-5 text-center md:h-96 leading-[150%] mx-auto">
        <h2 className="self-center text-base text-gray-200">Selected Projects: {inputProject.join(", ")}</h2>
        <div className="flex flex-wrap justify-center w-full gap-5 mt-5 pb-8 text-xl h-64 md:h-full text-white overflow-hidden overflow-y-auto">
          {dataSelections.map(dataSelection => (
            <SelectionData
              key={dataSelection}
              selected={selectedProjects.includes(dataSelection)} // Check if the project is selected
              onClick={() => handleProjectSelect(dataSelection)}
            >
              {dataSelection}
            </SelectionData>
          ))}
        </div>
      </section>
    </>
  );
};

export default ProjectSignUp;
