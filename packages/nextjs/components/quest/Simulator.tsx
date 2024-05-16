import * as React from "react";

interface CharacterCardProps {
  backgroundImage: string;
  characterImage: string;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ backgroundImage, characterImage }) => {
  return (
    <div className="flex flex-col items-center px-16 pt-12 pb-7 mt-1 rounded-md border-black border-solid bg-stone-700 border-[3px] max-md:px-5 max-md:max-w-full">
      <div className="flex gap-5 justify-between self-start text-3xl max-md:flex-wrap">
        <div className="text-white">Character</div>
        <div className="text-neutral-400">Hearts Left &lt;3</div>
      </div>
      <div className="flex overflow-hidden relative flex-col justify-center px-6 py-16 mt-20 w-full max-w-[651px] min-h-[483px] max-md:px-5 max-md:mt-10 max-md:max-w-full">
        <img src={backgroundImage} alt="" className="object-cover absolute inset-0 size-full" />
        <img src={characterImage} alt="Character" className="w-full aspect-[1.72] max-md:max-w-full" />
      </div>
      <button
        className="justify-center px-7 py-10 mt-20 text-xl text-center text-black shadow-sm bg-zinc-300 max-md:px-5 max-md:mt-10"
        onClick={() => console.log("Hello X")}
      >
        Change Background
      </button>
    </div>
  );
};

export const QuestSimulator: React.FC<{ title: string }> = ({ title = "Quest Simulator" }) => {
  return (
    <div className="flex flex-col justify-center rounded-xl border-black border-solid border-[3px] max-w-[923px]">
      <div className="flex flex-col px-2.5 pt-2.5 pb-8 w-full rounded-xl border-solid bg-stone-300 border-[10px] border-stone-300 max-md:max-w-full">
        <header className="flex gap-5 py-1.5 pr-2.5 pl-7 text-3xl text-black bg-yellow-900 rounded-md border-yellow-600 border-solid border-[3px] max-md:flex-wrap max-md:pl-5 max-md:max-w-full">
          <h1 className="flex-auto my-auto">{title}</h1>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/69c5bfe6e686f530d9d3830d4c5834004bb3be62236d23405b232d5245f8ab1d?apiKey=f105a41ce1294bd5b1f98d323241cf27&"
            alt="Quest Simulator Logo"
            className="shrink-0 aspect-[0.98] w-[45px]"
          />
        </header>
        <main>
          <CharacterCard
            backgroundImage="https://cdn.builder.io/api/v1/image/assets/TEMP/7c5c5149df4a6441dc3700b6bb7bc4fa619963546432dfa52826172fcf96a898?apiKey=f105a41ce1294bd5b1f98d323241cf27&"
            characterImage="https://cdn.builder.io/api/v1/image/assets/TEMP/aa1d1247a8f11655432a073d58fa235faac53eb6e531cd168de3460e5ab8c3c4?apiKey=f105a41ce1294bd5b1f98d323241cf27&"
          />
        </main>
      </div>
    </div>
  );
};
