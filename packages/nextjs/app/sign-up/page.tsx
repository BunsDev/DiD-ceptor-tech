"use client";

import * as React from "react";
import Typography from "~~/components/Typography";
import BackButton from "~~/components/signup-component/BackButton";
import Button from "~~/components/signup-component/Button";

const SignUp: React.FC = () => {
  const handleBack = () => {
    console.log("clik");
  };
  return (
    <main
      className="flex flex-col items-center pt-5 pr-20 pb-10 pl-5
     bg-black max-md:pr-5 h-screen"
    >
      <BackButton onClick={handleBack} />
      <div
        className="justify-center flex flex-col h-screen
      items-center gap-10"
      >
        <Typography text="Commission Artist Name" variant="title" />
        <Typography
          text="Use the following questions to describe your character and the art that you would like Artist Name to create in their style. If you already have a character created with Ceptor Club, select the Import button and we will fill out the questions for you!"
          variant="desc"
        />
        <section
          className="grid grid-cols-1 
      md:grid-cols-2 gap-4 w-full
      text-center md:w-[824px] 
      "
        >
          <Button text="Tell Us About Your Character" variant="fill" />
          <Button text="Import Character from Ceptor Club" variant="outline" />
        </section>
      </div>
    </main>
  );
};

export default SignUp;
