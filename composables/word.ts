import { getGenerativeModel, Schema } from "firebase/vertexai";

export const wordList: [string, string, Record<string, [string, number]>][] =
  reactive(JSON.parse(localStorage.getItem("wordList") || "[]"));

watch(wordList, () => {
  localStorage.setItem("wordList", JSON.stringify(wordList));
});

export const addWord = (w: string, l: string) => {
  if (wordList.find((v) => v[0] === w)) return;
  wordList.unshift([w, l, {}]);
};

/**
 * @param l language code including country code
 * @param n language name in the language
 */
export const genBasic = async (l: string, n: string, p?: string) => {
  const model = getGenerativeModel(vertexAI, {
    model: "gemini-2.0-flash",
    generationConfig: {
      responseSchema: Schema.array({ items: Schema.string() }),
      responseMimeType: "application/json",
    },
  });
  const prompt = (p || alter.gen_basic || lang.gen_basic).replace("{}", n);
  const result = await model.generateContentStream(prompt);
  const response = await result.response;
  const json = JSON.parse(response.text()) as string[];
  for (const w of json) {
    addWord(w, l);
  }
};

export const createSentence = async (words: string[]) => {
  const model = getGenerativeModel(vertexAI, {
    model: "gemini-2.0-flash",
    generationConfig: {
      responseSchema: Schema.string(),
      responseMimeType: "application/json",
    },
  });
  const prompt = (alter.createSentence || lang.createSentence) + "\n" + words;
  const result = await model.generateContentStream(prompt);
  const response = await result.response;
  const json = JSON.parse(response.text()) as string;
  return json;
};

export const translateSentence = async (
  sentence: string,
  src: string,
  dst: string
) => {
  const model = getGenerativeModel(vertexAI, {
    model: "gemini-2.0-flash",
    generationConfig: {
      responseSchema: Schema.string(),
      responseMimeType: "application/json",
      temperature: 0,
    },
  });
  const prompt =
    (alter.transA2B || lang.transA2B).replace("{A}", src).replace("{B}", dst) +
    "\n" +
    sentence;
  const result = await model.generateContentStream(prompt);
  const response = await result.response;
  const json = JSON.parse(response.text()) as string;
  return json;
};
