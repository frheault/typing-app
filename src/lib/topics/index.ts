import { biologySentence } from "./biology";
import { chemistrySentence } from "./chemistry";
import { engineeringSentence } from "./engineering";
import { physicsSentence } from "./physics";
import { computerScienceSentence } from "./computer_science";
import { mathematicsSentence } from "./mathematics";
import { ecologySentence } from "./ecology";

export const sentences = [
  ...biologySentence,
  ...physicsSentence,
  ...chemistrySentence,
  ...engineeringSentence,
  ...computerScienceSentence,
  ...mathematicsSentence,
  ...ecologySentence,
];
