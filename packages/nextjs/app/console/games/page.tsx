"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import CharacterCard from "~~/components/ceptor/CharacterCard";
import characters from "~~/components/ceptor/CharacterData";
import { Address } from "~~/components/scaffold-eth";

const Games: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Games-Scaffold 🏗🔴 </span>
          </h1>
          <div className="flex justify-center items-center space-x-2">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <div className="bg-gray-900 text-white w-full flex flex-wrap justify-around items-center p-5">
            {characters.map((character, index) => (
              <CharacterCard key={index} character={character} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Games;
