import type { Letter } from "@/types";

export const letters: Letter[] = [
  { character: "ਕ", name: "kakka", pronunciation: "ka", order: 1 },
  { character: "ਖ", name: "khakha", pronunciation: "kha", order: 2 },
  { character: "ਗ", name: "gagga", pronunciation: "ga", order: 3 },
  { character: "ਘ", name: "ghagha", pronunciation: "gha", order: 4 },
  { character: "ਙ", name: "nganga", pronunciation: "nga", order: 5 },
  { character: "ਚ", name: "chacha", pronunciation: "cha", order: 6 },
  { character: "ਛ", name: "chhachha", pronunciation: "chha", order: 7 },
  { character: "ਜ", name: "jajja", pronunciation: "ja", order: 8 },
  { character: "ਝ", name: "jhajha", pronunciation: "jha", order: 9 }
];

export const stageLabels = [
  "Learn",
  "Recognize",
  "Write",
  "Quiz"
] as const;
