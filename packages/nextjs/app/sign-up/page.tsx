import * as React from "react";
import Button from "~~/components/Button";

const SignUp: React.FC = () => {
  return (
    <main
      className="flex flex-col items-center pt-5 pr-20 pb-10 pl-5
     bg-black max-md:pr-5 h-screen"
    >
      <header className="flex gap-3 self-start text-xl leading-8 text-center text-white whitespace-nowrap">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/ea354ca918946ba706fe71510d8cb902d1e0817eba8d20f05876ddd99c6ed8dd?apiKey=527f3bea2d00438bb4c1fee76d176b0f&"
          className="shrink-0 aspect-square fill-white w-[30px]"
          alt="Back Icon"
        />
        <div className="my-auto">Back</div>
      </header>
      <div
        className="justify-center flex flex-col h-screen
      items-center gap-10"
      >
        <h1
          className=" text-5xl text-white leading-[76.8px] max-md:mt-10 max-md:max-w-full max-md:text-4xl
      font-milonga text-center"
        >
          Commission Artist Name
        </h1>
        <section
          className="text-base leading-6
       text-gray-200 lg:w-[840px] 
       max-md:mt-10 text-center 
      font-oswald"
        >
          Use the following questions to describe your character and the art that you would like Artist Name to create
          in their style. If you already have a character created with Ceptor Club, select the Import button and we will
          fill out the questions for you!
        </section>
        <section
          className="grid grid-cols-1 
      md:grid-cols-2 gap-4 w-full
      text-center md:w-[824px] 
      "
        >
          <Button text="Tell Us About Your Character" variant="fill" className="font-oswald" />
          <Button text="Import Character from Ceptor Club" variant="outline" className="font-oswald" />
        </section>
      </div>
    </main>
  );
};

export default SignUp;
