// components/ceptor/CharacterCard.tsx
import React from "react";

interface Character {
  name: string;
  classInfo: string;
  race: string;
  level: number;
  background: string;
  alignment: string;
  abilities: Record<string, number>;
  combatStats: {
    ac: number;
    hitPoints: number;
    initiative: number;
    speed: string;
  };
}

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  return (
    <div className="bg-gray-800 text-white p-5 rounded-lg shadow-md opacity-90">
      <h2 className="text-2xl font-bold">
        {character.name} - Level {character.level} {character.classInfo}
      </h2>
      <p>
        {character.race} | {character.background} | {character.alignment}
      </p>
      <div>
        <h3 className="font-bold">Abilities:</h3>
        {Object.entries(character.abilities).map(([ability, value]) => (
          <p key={ability}>
            {ability}: {value}
          </p>
        ))}
      </div>
      <div>
        <h3 className="font-bold">Combat Stats:</h3>
        <p>AC: {character.combatStats.ac}</p>
        <p>Hit Points: {character.combatStats.hitPoints}</p>
        <p>Initiative: {character.combatStats.initiative}</p>
        <p>Speed: {character.combatStats.speed}</p>
      </div>
    </div>
  );
};

export default CharacterCard;
