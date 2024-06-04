import React from "react";
import Typography from "~~/components/signup-component/Typography";

interface JoinWithUsProps {
  setTab: React.Dispatch<React.SetStateAction<number>>;
}

const JoinWithUs: React.FC<JoinWithUsProps> = () => {
  return (
    <>
      <div className="justify-center flex flex-col items-center gap-10">
        <Typography variant="title">Join With Us</Typography>
        <Typography variant="desc">
          Use the following questions to describe your character and the art that you would like Artist Name to create
          in their style. If you already have a character created with Ceptor Club, select the Import button and we will
          fill out the questions for you!
        </Typography>
      </div>
    </>
  );
};

export default JoinWithUs;
