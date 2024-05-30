// [1] ARGUMENT DECLARATION //

// gets: character class for the backstory.
const CHARACTER_CLASS = args[0]; // --------------> |   Wizard

// gets: character race for the backstory.
const CHARACTER_RACE = args[1]; // --------------> |   Elf

const CHARACTER_NAME = args[2]; // --------------> |   Eldon
// [2] PROMPT ENGINEERING //

const prompt = `Generate a D&D 5e backstory for ${CHARACTER_NAME}, a Level 1 ${CHARACTER_CLASS} who is a ${CHARACTER_RACE}. The backstory should be extremely short, dense, powerful, engaging, coherent, and suitable for a fantasy RPG setting. Just reply with the one paragraph backstory and nothing else.`;

// [3] AI DATA REQUEST //

// requests: OpenAI API using Functions
const openAIRequest = await Functions.makeHttpRequest({
  url: `https://api.openai.com/v1/chat/completions`,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${secrets.apiKey}`,
  },
  data: {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are generating a character backstory.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  },
  timeout: 10_000,
  maxTokens: 100,
  responseType: "json",
});

const response = await openAIRequest;

// finds: the response and returns the result (as a string).
const backstory = response.data?.choices[0].message.content;

console.log(`Generated backstory: %s`, backstory);

return Functions.encodeString(backstory || "Failed");
