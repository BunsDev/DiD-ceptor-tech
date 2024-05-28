import React from "react";
import BackButton from "../BackButton";
import Button from "../Button";
import Typography from "~~/components/Typography";

interface JoinWithUsProps {
  setTab: React.Dispatch<React.SetStateAction<number>>;
}

const JoinWithUs: React.FC<JoinWithUsProps> = ({ setTab }) => {
  const handleNext = () => {
    setTab(1);
  };
  const handleBack = () => {
    window.history.back();
  };

  return (
    <>
      <BackButton onClick={handleBack} />
      <div className="justify-center flex flex-col h-screen items-center gap-10">
        <Typography variant="title">Join With Us</Typography>
        <Typography variant="desc">
          Use the following questions to describe your character and the art that you would like Artist Name to create
          in their style. If you already have a character created with Ceptor Club, select the Import button and we will
          fill out the questions for you!
        </Typography>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-center md:w-[824px]">
          <Button variant="fill" onClick={handleNext}>
            Sign Up
          </Button>
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
        </section>
      </div>
    </>
  );
};

export default JoinWithUs;
