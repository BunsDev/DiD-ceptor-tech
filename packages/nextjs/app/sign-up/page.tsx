"use client";

import * as React from "react";
import BackButton from "~~/components/signup-component/BackButton";
import Button from "~~/components/signup-component/Button";
import Circle from "~~/components/signup-component/CircularSignUp";
import EmailSignUp from "~~/components/signup-component/pages/EmailSignUp";
import IDSignUp from "~~/components/signup-component/pages/IDSignUp";
import JoinWithUs from "~~/components/signup-component/pages/JoinWithUs";
import NameSignUp from "~~/components/signup-component/pages/NameSignUp";
import RoleSignUp from "~~/components/signup-component/pages/RoleSignUp";

const SignUp: React.FC = () => {
  const [tab, setTab] = React.useState(0);
  const [inputValue, setInputValue] = React.useState("");
  const [inputName, setInputName] = React.useState("");
  const [inputEmail, setInputEmail] = React.useState("");
  const [inputRole, setInputRole] = React.useState("");
  const [circlesData, setCirclesData] = React.useState([
    { isFilled: true },
    { isFilled: false },
    { isFilled: false },
    { isFilled: false },
    { isFilled: false },
    { isFilled: false },
    { isFilled: false },
    { isFilled: false },
    { isFilled: false },
    { isFilled: false },
    { isFilled: false },
    { isFilled: false },
  ]);

  const handleNext = () => {
    const newCirclesData = circlesData.map((circle, index) => ({
      isFilled: index < tab + 1,
    }));
    setCirclesData(newCirclesData);
    setTab(tab + 1);
  };

  const handleBack = () => {
    const newCirclesData = circlesData.map((circle, index) => ({
      isFilled: index < tab - 1,
    }));
    setCirclesData(newCirclesData);
    setTab(tab - 1);
  };

  const handleCircleClick = (index: number) => {
    const newCirclesData = circlesData.map((circle, i) => ({
      isFilled: i <= index,
    }));
    setCirclesData(newCirclesData);
    setTab(index + 1);
  };

  const stepLabels = ["ID", "Name", "Email"];

  return (
    <main
      className="flex flex-col items-center pt-5 pr-20 pb-10 pl-5
      bg-black max-md:pr-5 h-screen"
    >
      <BackButton onClick={handleBack} />
      {tab !== 0 && (
        // Inside SignUp component
        <section className="flex flex-col px-5 max-w-[520px]">
          {tab !== 0 && (
            <>
              <div className="flex gap-5 max-md:flex-wrap">
                {circlesData.map(({ isFilled }, index) => (
                  <Circle key={index} isFilled={isFilled} onClick={() => handleCircleClick(index)} />
                ))}
              </div>
              <p className="self-center mt-7 text-lg leading-7 text-center text-white">
                Step {tab} of {circlesData.length}: User {stepLabels[tab - 1]}
              </p>
            </>
          )}
        </section>
      )}

      {tab === 0 && <JoinWithUs setTab={setTab} />}
      {tab === 1 && <IDSignUp inputValue={inputValue} setInputValue={setInputValue} />}
      {tab === 2 && <NameSignUp inputName={inputName} setInputName={setInputName} />}
      {tab === 3 && <EmailSignUp inputEmail={inputEmail} setInputEmail={setInputEmail} />}
      {tab === 4 && <RoleSignUp inputRole={inputRole} setInputRole={setInputRole} />}

      {/* Add other components for subsequent tabs here */}
      <section
        className="grid grid-cols-1 
      lg:grid-cols-2 gap-4 w-full text-center 
      lg:w-[824px]"
      >
        {tab === 0 ? (
          <Button variant="fill" onClick={handleNext}>
            Sign Up
          </Button>
        ) : (
          <Button variant="fill" onClick={handleNext}>
            Next
          </Button>
        )}
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
      </section>
    </main>
  );
};

export default SignUp;
