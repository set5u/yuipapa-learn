import { getGenerativeModel, Schema } from "firebase/vertexai";

export const lang = {
  tell_native: "Please tell me your native language.",
  confirm: "Confirm",
  any_text_here: "Any text here",
  error: "ERROR_OCCUR",
  home: "Home",
  your_native: "Native language: {}",
  change: "Change",
  lang_list: "Language list that you are learning",
  add_button_below: "Press the button below to add a new language",
  add_button: "Add language",
  add_lang: "Please tell me the language that you want to learn",
  lang_code:
    "Please output the language code and language name of the following text:",
  delete: "Delete",
  learn: "Learn!",
  gen_basic: "Please generate 20 basic {} words.",
  gen_about: "Please generate 20 {} words relating to {0}.",
  word_list: "Word list",
  next_page: "Next page",
  prev_page: "Previous page",
  add_word: "Add word",
  add_word_about: "Add word relating to",
  generating: "Generating words list...",
  transA2B: "Translate the text below from {A} to {B}.",
  back: "Back",
  createSentence: "Make a sentence using all the words below:",
  generatingSentence: "Generating sentence...",
  answer: "Answer:",
  considering: "Considering...",
  A2BConsider:
    "Here is the original sentence:\\n{S}\\nHere is the user's translation:\\n{D}\\nPlease correct the following:\\n\\n- Grammatical errors\\n- Words that are misspelled\\n- Different meanings\\n\\nFinally, increase or decrease the comprehension score for each word.",
  listeningConsider:
    "Here is the original sentence:\\n{S}\\nHere is the user listened:\\n{D}\\nPlease correct the following:\\n\\n- Grammatical errors\\n- Words that are misspelled\\n- Different meanings\\n\\nFinally, increase or decrease the comprehension score for each word.",
  grammatical_errors: "Grammatical errors",
  words_that_are_misspelled: "Words that are misspelled",
  different_meanings: "Different meanings",
  comprehension_score_for_each_word: "Comprehension score each word",
  whats_wrong: "What's wrong",
  why_its_wrong: "Why it's wrong",
  how_to_fix_it: "How to fix it",
  correct_spelling: "Correct spelling",
  why_inc_or_dec: "Why increase or decrease",
  inc_or_dec: "Increase or decrease",
  inc: "Increase",
  dec: "Decrease",
  remain: "Remain the same",
  word_in_lang: "Word in {}",
  answer_in: "Please answer in {} as much as possible.",
  nothing: "Nothing here",
  next: "Next",
  storyLoop:
    "A loop that assembles the beginning, development, twist and conclusion",
  firstConstruct: "First, try assembling it",
  secondImprove: "Think about what you need to do to improve",
  thridDecide: "Decide if you need to reconsider",
  onceTry: "try writing it once",
  twiceRethink:
    "To improve what you have written, rethink the beginning, development, twist and conclusion",
  draft: "Draft",
  expand: "Places to expand the content",
  finalText: "Final text",
  translateInto: "Translate into {}",
  createStory: "Create a story using following words:",
  storyReading: "Read the story below and answer the questions",
  summarizeStory:
    "Please summarize this story. Each output should be about the same length.",
  correctSummary: "Correct summary",
  wrong1: "Summary of the opposite meanings",
  wrong2: "Similar but incorrect summary",
  wrong3: "Completely unrelated summary",
  storySummarizeQuestion: "Choose the correct summary of this passage",
  wrongScore:
    "In the following summary of the passage, the user made an incorrect choice. Increase or decrease the comprehension score of the word.",
  correctScore:
    "To summarize the following passage, the user made the correct choice. Increase or decrease the comprehension score of the word.",
  summarySelectedUser: "Summary selected by user",
  modeSelect: "Mode Select",
  A2BTranslation: "A2B Translation",
  B2ATranslation: "B2A Translation",
  readingSummarize: "Reading summarize",
  listening: "Listening",
  listenAgain: "Listen again",
};
export const alter: Partial<Record<keyof typeof lang, string>> = reactive(
  JSON.parse(localStorage.getItem("alter") ?? "{}")
);

export const native = ref(localStorage.getItem("native") ?? "");
export const nativeName = ref(localStorage.getItem("nativeName") ?? "");
export const nativeNameInLang = ref(
  localStorage.getItem("nativeNameInLang") ?? ""
);

watch(alter, () => {
  localStorage.setItem("alter", JSON.stringify(alter));
});
watch(native, () => {
  localStorage.setItem("native", native.value);
});
watch(nativeName, () => {
  localStorage.setItem("nativeName", nativeName.value);
});
watch(nativeNameInLang, () => {
  localStorage.setItem("nativeNameInLang", nativeNameInLang.value);
});

export const translateIfNeeded = async () => {
  for (const la in lang) {
    if (!(la in alter)) {
      await translate(native.value, nativeName.value);
      return;
    }
  }
};

export const translate = async (l: string, n: string) => {
  if (l === "en-US" || l === "en") {
    for (const k in lang) {
      delete alter[k as keyof typeof lang];
    }
    return;
  }
  const kv: Record<string, Schema> = {};
  const vk: Record<string, string> = {};
  for (const k in lang) {
    kv[lang[k as keyof typeof lang]] = Schema.string();
    vk[lang[k as keyof typeof lang]] = k;
  }
  const schema = Schema.object({
    properties: kv,
  });
  const prompt = `Please translate English into ${n}`;

  const model = getGenerativeModel(vertexAI, {
    model: "gemini-2.0-flash",
    generationConfig: {
      responseSchema: schema,
      responseMimeType: "application/json",
      temperature: 0,
    },
  });
  const result = await model.generateContentStream(prompt);
  const response = await result.response;
  const json = JSON.parse(response.text());
  for (const j in json) {
    alter[vk[j.replaceAll("\n", "\\n")] as keyof typeof lang] = json[j];
  }
};
