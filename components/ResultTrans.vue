<template>
  <div class="h3">
    {{ alter.grammatical_errors || lang.grammatical_errors }}
  </div>
  <ol
    v-if="
      json['0_' + (alter.grammatical_errors || lang.grammatical_errors)].length
    "
  >
    <li
      v-for="l of json[
        '0_' + (alter.grammatical_errors || lang.grammatical_errors)
      ]"
    >
      <ul>
        <li>
          {{ alter.whats_wrong || lang.whats_wrong }}:{{
            l["0_" + (alter.whats_wrong || lang.whats_wrong)]
          }}
        </li>
        <li>
          {{ alter.why_its_wrong || lang.why_its_wrong }}:{{
            l["1_" + (alter.why_its_wrong || lang.why_its_wrong)]
          }}
        </li>
        <li>
          {{ alter.how_to_fix_it || lang.how_to_fix_it }}:{{
            l["2_" + (alter.how_to_fix_it || lang.how_to_fix_it)]
          }}
        </li>
      </ul>
    </li>
  </ol>
  <div v-else>{{ alter.nothing || lang.nothing }}</div>
  <div class="h3">
    {{ alter.words_that_are_misspelled || lang.words_that_are_misspelled }}
  </div>
  <ol
    v-if="
      json[
        '1_' +
          (alter.words_that_are_misspelled || lang.words_that_are_misspelled)
      ].length
    "
  >
    <li
      v-for="l of json[
        '1_' +
          (alter.words_that_are_misspelled || lang.words_that_are_misspelled)
      ]"
    >
      <ul>
        <li>
          {{ alter.whats_wrong || lang.whats_wrong }}:{{
            l["0_" + (alter.whats_wrong || lang.whats_wrong)]
          }}
        </li>
        <li>
          {{ alter.why_its_wrong || lang.why_its_wrong }}:{{
            l["1_" + (alter.why_its_wrong || lang.why_its_wrong)]
          }}
        </li>
        <li>
          {{ alter.correct_spelling || lang.correct_spelling }}:{{
            l["2_" + (alter.correct_spelling || lang.correct_spelling)]
          }}
        </li>
      </ul>
    </li>
  </ol>
  <div v-else>{{ alter.nothing || lang.nothing }}</div>
  <div class="h3">
    {{ alter.different_meanings || lang.different_meanings }}
  </div>
  <ol
    v-if="
      json['2_' + (alter.different_meanings || lang.different_meanings)].length
    "
  >
    <li
      v-for="l of json[
        '2_' + (alter.different_meanings || lang.different_meanings)
      ]"
    >
      <ul>
        <li>
          {{ alter.whats_wrong || lang.whats_wrong }}:{{
            l["0_" + (alter.whats_wrong || lang.whats_wrong)]
          }}
        </li>
        <li>
          {{ alter.why_its_wrong || lang.why_its_wrong }}:{{
            l["1_" + (alter.why_its_wrong || lang.why_its_wrong)]
          }}
        </li>
        <li>
          {{ alter.how_to_fix_it || lang.how_to_fix_it }}:{{
            l["2_" + (alter.how_to_fix_it || lang.how_to_fix_it)]
          }}
        </li>
      </ul>
    </li>
  </ol>
  <div v-else>{{ alter.nothing || lang.nothing }}</div>
  <div class="h3">
    {{
      alter.comprehension_score_for_each_word ||
      lang.comprehension_score_for_each_word
    }}
  </div>
  <ol
    v-if="
      json[
        '3_' +
          (alter.comprehension_score_for_each_word ||
            lang.comprehension_score_for_each_word)
      ].length
    "
  >
    <li
      v-for="l of json[
        '3_' +
          (alter.comprehension_score_for_each_word ||
            lang.comprehension_score_for_each_word)
      ]"
    >
      <ul>
        <li>
          {{ alter.inc_dec_word || lang.inc_dec_word }}:{{
            l["0_" + (alter.inc_dec_word || lang.inc_dec_word)]
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
</template>

<script setup lang="ts">
  defineProps<{ json: Record<string, any> }>();
</script>
