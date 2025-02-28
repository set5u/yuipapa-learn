<template>
  <div class="text-start" v-if="native">
    <button class="btn btn-outline-primary m-4" @click="is = Home">
      {{ alter.back || lang.back }}
    </button>
  </div>
  <div v-if="error">{{ alter.error || lang.error }}</div>
  <div class="h1">
    {{ alter.listening || lang.listening }}
  </div>
  <div class="h3">
    {{ generating ? alter.generatingSentence || lang.generatingSentence : "" }}
  </div>
  <input class="form-control" v-model="user" :disabled @keyup.enter="onClick" />
  <button
    class="btn btn-outline-primary m-4"
    @click="speak(selectedLang, sentence)"
  >
    {{ alter.listenAgain || lang.listenAgain }}
  </button>
  <button class="btn btn-outline-primary m-4" :onClick :disabled>
    {{ alter.confirm || lang.confirm }}
  </button>
  <div v-if="disabled">
    <div class="h3">{{ alter.answer || lang.answer }} {{ sentence }}</div>
    <div class="h3" v-if="considering">
      {{ alter.considering || lang.considering }}
    </div>
    <div v-else class="text-start">
      <ResultTrans :json></ResultTrans>
    </div>
    <div v-if="!considering">
      <button class="btn btn-outline-primary m-4" @click="is = Learn">
        {{ alter.next || lang.next }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { getGenerativeModel, Schema } from "firebase/vertexai";
  import Home from "./Home.vue";
  import Learn from "./Learn.vue";
  const is = inject<Ref<Component>>("is")!;
  const generating = ref(true);
  const error = ref(false);
  const answer = ref("");
  const sentence = ref("");
  const B = langList.find((v) => v[1] === selectedLang.value)!;
  const user = ref("");
  const considering = ref(false);
  const disabled = ref(false);
  const json = ref<Record<string, any>>({});
  let running = true;
  onUnmounted(() => (running = false));
  onMounted(async () => {
    try {
      answer.value = await createSentence(
        wordList
          .slice(0, 3)
          .map((v) => v[0])
          .reverse()
      );
      wordList
        .slice(0, 3)
        .forEach(
          (v) =>
            v[2][selectedLang.value] && (v[2][selectedLang.value][1] += 0.2)
        );
      if (!running) {
        return;
      }
      sentence.value = await translateSentence(
        answer.value,
        nativeNameInLang.value,
        B[4]
      );
      generating.value = false;
      if (!running) {
        return;
      }
      speak(selectedLang.value, sentence.value);
    } catch {
      error.value = true;
    }
  });
  const onClick = async () => {
    if (!user.value) {
      return;
    }
    disabled.value = true;
    considering.value = true;
    try {
      const model = getGenerativeModel(vertexAI, {
        model: "gemini-2.0-flash",
        systemInstruction: (alter.answer_in || lang.answer_in).replace(
          "{}",
          nativeName.value
        ),
        generationConfig: {
          responseSchema: Schema.object({
            properties: {
              ["0_" + (alter.grammatical_errors || lang.grammatical_errors)]:
                Schema.array({
                  items: Schema.object({
                    properties: {
                      ["0_" + (alter.whats_wrong || lang.whats_wrong)]:
                        Schema.string(),
                      ["1_" + (alter.why_its_wrong || lang.why_its_wrong)]:
                        Schema.string(),
                      ["2_" + (alter.how_to_fix_it || lang.how_to_fix_it)]:
                        Schema.string(),
                    },
                  }),
                }),
              ["1_" +
              (alter.words_that_are_misspelled ||
                lang.words_that_are_misspelled)]: Schema.array({
                items: Schema.object({
                  properties: {
                    ["0_" + (alter.whats_wrong || lang.whats_wrong)]:
                      Schema.string(),
                    ["1_" + (alter.why_its_wrong || lang.why_its_wrong)]:
                      Schema.string(),
                    ["2_" + (alter.correct_spelling || lang.correct_spelling)]:
                      Schema.string(),
                  },
                }),
              }),
              ["2_" + (alter.different_meanings || lang.different_meanings)]:
                Schema.array({
                  items: Schema.object({
                    properties: {
                      ["0_" + (alter.whats_wrong || lang.whats_wrong)]:
                        Schema.string(),
                      ["1_" + (alter.why_its_wrong || lang.why_its_wrong)]:
                        Schema.string(),
                      ["2_" + (alter.how_to_fix_it || lang.how_to_fix_it)]:
                        Schema.string(),
                    },
                  }),
                }),
              ["3_" +
              (alter.comprehension_score_for_each_word ||
                lang.comprehension_score_for_each_word)]: Schema.array({
                items: Schema.object({
                  properties: {
                    ["0_" +
                    (alter.word_in_lang || lang.word_in_lang).replace(
                      "{}",
                      selectedLang.value
                    )]: Schema.string(),
                    ["1_" +
                    (alter.word_in_lang || lang.word_in_lang).replace(
                      "{}",
                      nativeNameInLang.value
                    )]: Schema.string(),
                    ["2_" + (alter.why_inc_or_dec || lang.why_inc_or_dec)]:
                      Schema.string(),
                    ["3_" + (alter.inc_or_dec || lang.inc_or_dec)]:
                      Schema.enumString({
                        enum: [
                          alter.inc || lang.inc,
                          alter.dec || lang.dec,
                          alter.remain || lang.remain,
                        ],
                      }),
                  },
                }),
              }),
            },
          }),
          responseMimeType: "application/json",
          temperature: 0,
        },
      });
      const prompt = (alter.listeningConsider || lang.listeningConsider)
        .replace("{S}", sentence.value)
        .replace("{D}", user.value);
      const result = await model.generateContentStream(prompt);
      const response = await result.response;
      json.value = JSON.parse(response.text());
      considering.value = false;
    } catch {
      error.value = true;
    }
    mutateScores(
      json.value[
        "3_" +
          (alter.comprehension_score_for_each_word ||
            lang.comprehension_score_for_each_word)
      ],
      0.5
    );
  };
</script>
