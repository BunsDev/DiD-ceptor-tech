interface Character {
  name: string;
  race: string;
  classInfo: string;
  level: number;
  background: string;
  alignment: string;
  player: string;
  abilities: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  proficiencies: {
    armor: string[];
    weapons: string[];
    tools: string[];
    savingThrows: string[];
    skills: string[];
  };
  featuresTraits: string[];
  equipment: string[];
  combatStats: {
    ac: number;
    initiative: number;
    speed: string;
    hitPoints: number;
  };
}

const characters: Character[] = [
  {
    name: "猪八戒",
    race: "Zhu Bajie",
    classInfo: "Fighter",
    level: 1,
    background: "Folk Hero",
    alignment: "Neutral Good",
    player: "Allan Ma",
    abilities: {
      strength: 15,
      dexterity: 10,
      constitution: 16,
      intelligence: 8,
      wisdom: 13,
      charisma: 12,
    },
    proficiencies: {
      armor: ["All armor", "shields"],
      weapons: ["Simple weapons", "martial weapons"],
      tools: ["Brewer's supplies"],
      savingThrows: ["Strength", "Constitution"],
      skills: ["Athletics", "Perception"],
    },
    featuresTraits: [
      "Pig's Resilience: Resistance to poison damage and advantage on saving throws against poison.",
      "Noble Heart: Proficiency in Insight.",
      "Forager: Can find food and fresh water for himself and up to five others each day in suitable environments.",
      "Fighting Style (Defense): +1 bonus to AC while wearing armor.",
      "Second Wind: Use a bonus action to regain hit points equal to 1d10 + your fighter level once per short or long rest.",
    ],
    equipment: [
      "Guandao (1d12 slashing damage, heavy, two-handed)",
      "Chain mail (AC 16)",
      "Adventurer's pack",
      "Flask of strong liquor",
      "Signet of his celestial origin",
      "Set of common clothes",
    ],
    combatStats: {
      ac: 17,
      initiative: 0,
      speed: "30 feet",
      hitPoints: 13,
    },
  },
];

export default characters;
