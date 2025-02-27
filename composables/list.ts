export const langList: [string, string, string, string, string][] = reactive(
  JSON.parse(localStorage.getItem("langList") || "[]")
);

watch(langList, () => {
  localStorage.setItem("langList", JSON.stringify(langList));
});

export const selectedLang = ref("");
