"use client";

import * as React from "react";
import IDSignUp from "~~/components/signup-component/pages/IDSignUp";
import JoinWithUs from "~~/components/signup-component/pages/JoinWithUs";

const SignUp: React.FC = () => {
  const [tab, setTab] = React.useState(0);

  return (
    <main
      className="flex flex-col items-center pt-5 pr-20 pb-10 pl-5
      bg-black max-md:pr-5 h-screen"
    >
      {tab === 0 && <JoinWithUs setTab={setTab} />}
      {tab === 1 && <IDSignUp setTab={setTab} />}
    </main>
  );
};

export default SignUp;
