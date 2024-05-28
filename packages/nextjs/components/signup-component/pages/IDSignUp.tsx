import React from "react";
import BackButton from "../BackButton";
import Button from "../Button";
import Typography from "~~/components/Typography";

interface IDSignUp {
  setTab: React.Dispatch<React.SetStateAction<number>>;
}
const IDSignUp: React.FC<IDSignUp> = ({ setTab }) => {
  const handleNext = () => {
    setTab(0);
  };
  const handleBack = () => {
    setTab(0);
  };

  return (
    <>
      <BackButton onClick={handleBack} />
      <div
        className="justify-center flex flex-col h-screen
          items-center gap-10"
      >
        <Typography variant="title">Input your ID with Etherium</Typography>
        <Typography variant="desc">
          Use the following questions to describe your character and the art that you would like Artist Name to create
          in their style. If you already have a character created with Ceptor Club, select the Import button and we will
          fill out the questions for you!
        </Typography>
        <section
          className="grid grid-cols-1 
            md:grid-cols-2 gap-4 w-full 
            text-center md:w-[824px] "
        >
          <Button variant="fill" onClick={handleNext}>
            Next
          </Button>
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
        </section>
      </div>
    </>
  );
};

export default IDSignUp;
