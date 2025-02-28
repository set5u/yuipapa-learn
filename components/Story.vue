<template>
  <div class="text-start" v-if="native">
    <button class="btn btn-outline-primary m-4" @click="is = Home">
      {{ alter.back || lang.back }}
    </button>
  </div>
  <div v-if="error">{{ alter.error || lang.error }}</div>
  <div class="h1">
    {{ alter.storyReading || lang.storyReading }}
  </div>
  <div class="h6">
    {{
      generating
        ? alter.generatingSentence || lang.generatingSentence
        : story[1]
    }}
  </div>
  <div class="text-start" v-if="!generating">
    <div class="h6 m-4">
      {{ alter.storySummarizeQuestion || lang.storySummarizeQuestion }}
    </div>
    [A]
    <input
      type="radio"
      class="m-2"
      v-model="user"
      :value="prob[0][2]"
      id="prob0"
      :disabled
    />
    <br />
    <label for="prob0">{{ prob[0][1] }}</label
    ><br />[B]<input
      class="m-2"
      type="radio"
      v-model="user"
      :value="prob[1][2]"
      id="prob1"
      :disabled
    /><br />
    <label for="prob1">{{ prob[1][1] }}</label
    ><br />[C]<input
      class="m-2"
      type="radio"
      v-model="user"
      :value="prob[2][2]"
      id="prob2"
      :disabled
    /><br />
    <label for="prob2">{{ prob[2][1] }}</label
    ><br />[D]<input
      class="m-2"
      type="radio"
      v-model="user"
      :value="prob[3][2]"
      id="prob3"
      :disabled
    />
    <label for="prob3">{{ prob[3][1] }}</label>
    <div>
      <button class="btn btn-outline-primary m-4" :onClick :disabled>
        {{ alter.confirm || lang.confirm }}
      </button>
    </div>
    <div v-if="disabled">
      <div class="h3">
        {{ alter.answer || lang.answer
        }}{{ ["[A]", "[B]", "[C]", "[D]"][prob.findIndex((v) => v[2] === 0)] }}
      </div>
      <div class="h6">{{ story[0] }}</div>
      <ul>
        <li>[A]: {{ prob[0][0] }}</li>
        <li>[B]: {{ prob[1][0] }}</li>
        <li>[C]: {{ prob[2][0] }}</li>
        <li>[D]: {{ prob[3][0] }}</li>
      </ul>
      <div class="h3" v-if="considering">
        {{ alter.considering || lang.considering }}
      </div>
      <template v-else
        ><div class="h3">
          {{
            alter.comprehension_score_for_each_word ||
            lang.comprehension_score_for_each_word
          }}
        </div>
        <ol v-if="json.length">
          <li v-for="l of json">
            <ul>
              <li>
                {{
                  l[
                    "0_" +
                      (alter.word_in_lang || lang.word_in_lang).replace(
                        "{}",
                        selectedLang
                      )
                  ]
                }}/
                {{
                  l[
                    "1_" +
                      (alter.word_in_lang || lang.word_in_lang).replace(
                        "{}",
                        nativeNameInLang
                      )
                  ]
                }}:{{ l["2_" + (alter.why_inc_or_dec || lang.why_inc_or_dec)] }}
              </li>
              <li>
                {{ l["3_" + (alter.inc_or_dec || lang.inc_or_dec)] }}
              </li>
            </ul>
          </li>
        </ol>
        <div v-else>{{ alter.nothing || lang.nothing }}</div>
        <button class="btn btn-outline-primary m-4" @click="is = Learn">
          {{ alter.next || lang.next }}
        </button>
      </template>
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
  const story = ref(["", ""]);
  const prob = ref<[string, string, number][]>([]);
  const considering = ref(false);
  const user = ref(-1);
  const disabled = ref(false);
  const json = ref<Record<string, string>[]>([]);
  const onClick = async () => {
    if (user.value === -1) {
      return;
    }
    disabled.value = true;
    considering.value = true;
    try {
      const model = getGenerativeModel(vertexAI, {
        model: "gemini-2.0-flash",
        generationConfig: {
          responseSchema: Schema.array({
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
          responseMimeType: "application/json",
          temperature: 0,
        },
      });
      const prompt =
        (user.value
          ? alter.wrongScore || lang.wrongScore
          : alter.correctScore || lang.correctScore) +
        story.value[0] +
        "\n" +
        (alter.summarySelectedUser || lang.summarySelectedUser) +
        "\n";
      prob.value.find((v) => v[2] === 0)![0];
      const result = await model.generateContentStream(prompt);
      const response = await result.response;
      json.value = JSON.parse(response.text());
    } catch {
      error.value = true;
    }
    mutateScores(json.value, 1);
    considering.value = false;
  };
  onMounted(async () => {
    try {
      story.value = await createStory(
        wordList
          .slice(0, 10)
          .map((v) => v[0])
          .reverse()
      );
      wordList
        .slice(0, 10)
        .forEach(
          (v) =>
            v[2][selectedLang.value] && (v[2][selectedLang.value][1] += 0.2)
        );
      prob.value = await generateStoryProblem(story.value);
      for (let i = 0; i < 4; i++) {
        const rad = (Math.random() * 4) | 0;
        [prob.value[i], prob.value[rad]] = [prob.value[rad], prob.value[i]];
      }
      generating.value = false;
    } catch {
      error.value = true;
    }
  });
</script>
