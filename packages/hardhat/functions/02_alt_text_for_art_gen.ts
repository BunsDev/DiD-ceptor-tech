// [1] ARGUMENT DECLARATION //

// gets: character class for the backstory.
const CHARACTER_CLASS = args[0]; // --------------> |   Wizard

// gets: character race for the backstory.
const CHARACTER_RACE = args[1]; // --------------> |   Elf

const CHARACTER_NAME = args[2]; // --------------> |   Eldon

// gets: character alignment for the backstory.
const CHARACTER_ALIGNMENT = args[3]; // --------------> |   Lawful Good

// gets: character background for the backstory.
const CHARACTER_BACKGROUND = args[4]; // --------------> |   Noble

// gets: character traits for the backstory.
const CHARACTER_TRAITS = args[5]; // --------------> |   Brave and kind-hearted

// gets: character ideals for the backstory.
const CHARACTER_IDEALS = args[6]; // --------------> |   Protect the weak

// gets: character bonds for the backstory.
const CHARACTER_BONDS = args[7]; // --------------> |   Family

// gets: character flaws for the backstory.
const CHARACTER_FLAWS = args[8]; // --------------> |   Trusts too easily

// [2] PROMPT ENGINEERING //

const prompt = `Generate a descriptive alt text for AI art generation based on the following D&D character details:
- Name: ${CHARACTER_NAME}
- Class: ${CHARACTER_CLASS}
- Race: ${CHARACTER_RACE}
- Alignment: ${CHARACTER_ALIGNMENT}
- Background: ${CHARACTER_BACKGROUND}
- Traits: ${CHARACTER_TRAITS}
- Ideals: ${CHARACTER_IDEALS}
- Bonds: ${CHARACTER_BONDS}
- Flaws: ${CHARACTER_FLAWS}

The alt text should be detailed, engaging, and suitable for generating AI art. Just reply with the alt text and nothing else.`;

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
        content: "You are generating alt text for AI art based on character details.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 50,
  },
  timeout: 10_000,
  responseType: "json",
});

if (openAIRequest.error) throw new Error("OpenAI API request failed.");
// finds: the response and returns the result (as a string).
const altText = openAIRequest.data?.choices[0].message.content;

console.log(`Generated alt text: %s`, altText);

return Functions.encodeString(altText || "Failed");
