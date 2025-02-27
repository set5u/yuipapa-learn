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
  gen_basic: "Please generate 100 basic {} words.",
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

export const translate = async (l: string, n: string) => {
  if (l === "en") {
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
    alter[vk[j] as keyof typeof lang] = json[j];
  }
};
