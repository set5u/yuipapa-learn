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

export const createStory = async (words: string[]) => {
  const model = getGenerativeModel(vertexAI, {
    model: "gemini-2.0-flash",
    generationConfig: {
      responseSchema: Schema.object({
        properties: {
          ["0_" + (alter.storyLoop || lang.storyLoop)]: Schema.object({
            properties: {
              ["0_" + (alter.firstConstruct || lang.firstConstruct)]:
                Schema.array({ items: Schema.string() }),
              ["1_" + (alter.secondImprove || lang.secondImprove)]:
                Schema.array({ items: Schema.string() }),
              ["2_" + (alter.thridDecide || lang.thridDecide)]: Schema.array({
                items: Schema.string(),
              }),
            },
          }),
          ["1_" + (alter.onceTry || lang.onceTry)]: Schema.string(),
          ["2_" + (alter.twiceRethink || lang.twiceRethink)]: Schema.array({
            items: Schema.string(),
          }),
          ["3_" + (alter.draft || lang.draft)]: Schema.string(),
          ["4_" + (alter.expand || lang.expand)]: Schema.array({
            items: Schema.string(),
          }),
          ["5_" + (alter.finalText || lang.finalText)]: Schema.string(),
          ["6_" +
          (alter.translateInto || lang.translateInto).replace(
            "{}",
            selectedLang.value
          )]: Schema.string(),
        },
      }),
      responseMimeType: "application/json",
    },
  });
  const prompt = (alter.createStory || lang.createStory) + words;
  const result = await model.generateContentStream(prompt);
  const response = await result.response;
  const json = JSON.parse(response.text()) as Record<string, string>;
  return [
    json["5_" + (alter.finalText || lang.finalText)],
    json[
      "6_" +
        (alter.translateInto || lang.translateInto).replace(
          "{}",
          selectedLang.value
        )
    ],
  ];
};

export const generateStoryProblem = async (story: string[]) => {
  const model = getGenerativeModel(vertexAI, {
    model: "gemini-2.0-flash",
    generationConfig: {
      responseSchema: Schema.object({
        properties: {
          ["0_" + (alter.correctSummary || lang.correctSummary)]:
            Schema.string(),
          ["1_" + (alter.wrong1 || lang.wrong1)]: Schema.string(),
          ["2_" + (alter.wrong2 || lang.wrong2)]: Schema.string(),
          ["3_" + (alter.wrong3 || lang.wrong3)]: Schema.string(),
          ["4_" +
          (alter.translateInto || lang.translateInto).replace(
            "{}",
            selectedLang.value
          )]: Schema.object({
            properties: {
              ["0_" + (alter.correctSummary || lang.correctSummary)]:
                Schema.string(),
              ["1_" + (alter.wrong1 || lang.wrong1)]: Schema.string(),
              ["2_" + (alter.wrong2 || lang.wrong2)]: Schema.string(),
              ["3_" + (alter.wrong3 || lang.wrong3)]: Schema.string(),
            },
          }),
        },
      }),
      responseMimeType: "application/json",
      temperature: 0,
    },
  });
  const prompt = (alter.summarizeStory || lang.summarizeStory) + story[0];
  const result = await model.generateContentStream(prompt);
  const response = await result.response;
  const prob1 = JSON.parse(response.text()) as Record<
    string,
    string | Record<string, string>
  >;
  const prob1E = prob1[
    "4_" +
      (alter.translateInto || lang.translateInto).replace(
        "{}",
        selectedLang.value
      )
  ] as Record<string, string>;
  const prob1F: [string, string, number][] = [
    [
      prob1["0_" + (alter.correctSummary || lang.correctSummary)] as string,
      prob1E["0_" + (alter.correctSummary || lang.correctSummary)],
      0,
    ],
    [
      prob1["1_" + (alter.wrong1 || lang.wrong1)] as string,
      prob1E["1_" + (alter.wrong1 || lang.wrong1)],
      1,
    ],
    [
      prob1["2_" + (alter.wrong2 || lang.wrong2)] as string,
      prob1E["2_" + (alter.wrong2 || lang.wrong2)],
      2,
    ],
    [
      prob1["3_" + (alter.wrong3 || lang.wrong3)] as string,
      prob1E["3_" + (alter.wrong3 || lang.wrong3)],
      3,
    ],
  ];
  return prob1F;
};

/*
{
  ["0_" + ((alter.word_in_lang || lang.word_in_lang).replace("{}",selectedLang.value))]:
    Schema.string(),
  ["1_" +
  (alter.word_in_lang || lang.word_in_lang).replace(
    "{}",
    nativeNameInLang.value
  )]: Schema.string(),
  ["2_" + (alter.why_inc_or_dec || lang.why_inc_or_dec)]:
    Schema.string(),
  ["3_" + (alter.inc_or_dec || lang.inc_or_dec)]:
    Schema.enumString({
      enum: [alter.inc || lang.inc, alter.dec || lang.dec],
    }),
}
*/
export const mutateScores = (l: any[], m: number = 1) => {
  for (const la of l) {
    const wa =
      la[
        "0_" +
          (alter.word_in_lang || lang.word_in_lang).replace(
            "{}",
            selectedLang.value
          )
      ];
    const w =
      la[
        "1_" +
          (alter.word_in_lang || lang.word_in_lang).replace(
            "{}",
            nativeNameInLang.value
          )
      ];
    let wl = wordList.find((v) => v[0] === w);
    if (!wl) {
      wl = [w, native.value, {}];
      wordList.unshift(wl);
    }
    if (!wl[2][selectedLang.value]) {
      wl[2][selectedLang.value] = [wa, 0];
    } else {
      wl[2][selectedLang.value][0] = wa;
    }
    const i = la["3_" + (alter.inc_or_dec || lang.inc_or_dec)];
    if (i === (alter.inc || i === lang.inc)) {
      wl[2][selectedLang.value][1] += m;
    } else if (i === (alter.dec || i === lang.dec)) {
      wl[2][selectedLang.value][1] -= m;
    }
  }
};
