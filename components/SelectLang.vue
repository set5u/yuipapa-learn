<template>
  <input
    class="form-control my-4"
    v-model="name"
    :placeholder="alter.any_text_here || lang.any_text_here"
    :disabled
    @keyup.enter="onClick"
  />
  <div v-if="error" class="my-4">{{ alter.error || lang.error }}</div>
  <button class="btn btn-outline-primary" :onClick :disabled>
    {{ alter.confirm || lang.confirm }}
  </button>
</template>

<script setup lang="ts">
  import { getGenerativeModel, Schema } from "firebase/vertexai";
  const emit = defineEmits<{
    (
      e: "confirm",
      val: {
        language_code: string;
        language_name: string;
        language_name_in_the_language: string;
        language_code_including_country_code: string;
      },
      name: string
    ): void;
  }>();
  const name = ref("");
  const disabled = ref(false);
  const error = ref(false);
  const onClick = async () => {
    if (!name.value) {
      return;
    }
    disabled.value = true;
    try {
      const model = getGenerativeModel(vertexAI, {
        model: "gemini-2.0-flash",
        generationConfig: {
          responseSchema: Schema.object({
            properties: {
              language_code_including_country_code: Schema.string(),
              language_code: Schema.string(),
              language_name: Schema.string(),
              language_name_in_the_language: Schema.string(),
              ["language_name_in_" + native.value]: Schema.string(),
            },
          }),
          responseMimeType: "application/json",
          temperature: 0,
        },
      });
      const prompt = (alter.lang_code || lang.lang_code) + name.value;
      const result = await model.generateContentStream(prompt);
      const response = await result.response;
      const json = JSON.parse(response.text()) as {
        language_code: string;
        language_code_including_country_code: string;
        language_name: string;
        language_name_in_the_language: string;
      };
      emit(
        "confirm",
        json,
        json[("language_name_in_" + native.value) as "language_code"]
      );
    } catch {
      error.value = true;
    }
  };
</script>
