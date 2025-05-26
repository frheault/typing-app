import { Link, createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useSentenceStore } from "../store/sentenceStore";
import TypingTest from "../components/TypingTest";
// shuffleArray is not strictly needed here anymore if index is passed
import { ArrowLeft, HomeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { deobfuscateText } from "../lib/obfuscation";

const practiceSearchSchema = z.object({
  topic: z.string().optional(),
  eclipsedTime: z.number().optional().catch(60).optional(),
  savedTextId: z.number().optional(),
  sentenceIndex: z.number().optional(), // Added sentenceIndex
});

export const Route = createFileRoute("/practice")({
  component: () => <Practice />,
  validateSearch: (search: Record<string, unknown>) =>
    practiceSearchSchema.parse(search),
});

interface SavedPracticeData {
  id: number;
  label: string;
  text: string;
  language: "python" | "cpp" | "plaintext";
  isObfuscated: boolean;
  time?: string;
}

const Practice = () => {
  const { topic, eclipsedTime, savedTextId, sentenceIndex } = Route.useSearch(); // Get sentenceIndex
  const [practiceItem, setPracticeItem] = useState<Omit<SavedPracticeData, 'isObfuscated' | 'time'> & { text: string } | null>(null);
  const [currentSentence, setCurrentSentence] = useState<string>("");
  const [practiceLanguage, setPracticeLanguage] = useState<"python" | "cpp" | "plaintext">("plaintext");


  const allSentencesByTopic = useSentenceStore((state) =>
    topic ? state.getSentencesByTopic(topic) : []
  );

  useEffect(() => {
    setPracticeItem(null); // Reset practice item by default
    setCurrentSentence("");   // Reset current sentence
    setPracticeLanguage("plaintext");

    if (savedTextId) {
      const storedCustomTexts = localStorage.getItem("customTextData");
      if (storedCustomTexts) {
        const customTextsArray: SavedPracticeData[] = JSON.parse(storedCustomTexts);
        const foundItem = customTextsArray.find(item => item.id === savedTextId);

        if (foundItem) {
          let finalText = foundItem.text;
          if (foundItem.isObfuscated) {
            finalText = deobfuscateText(foundItem.text); //
          }
          setPracticeItem({
            id: foundItem.id,
            label: foundItem.label,
            text: finalText,
            language: foundItem.language,
          });
          setCurrentSentence(finalText);
          setPracticeLanguage(foundItem.language);
        }
      }
    } else if (topic && allSentencesByTopic.length > 0) {
      if (sentenceIndex !== undefined && sentenceIndex >= 0 && sentenceIndex < allSentencesByTopic.length) {
        // Use the sentenceIndex passed from App.tsx
        setCurrentSentence(allSentencesByTopic[sentenceIndex]);
      } else {
        // Fallback: if sentenceIndex is not provided or invalid, pick a random one (optional, could also be an error)
        console.warn("Sentence index not provided or invalid, picking random. Topic:", topic);
        const randomIndex = Math.floor(Math.random() * allSentencesByTopic.length);
        setCurrentSentence(allSentencesByTopic[randomIndex]);
      }
      setPracticeLanguage("plaintext");
    }
    // If no conditions met, currentSentence remains ""
  }, [savedTextId, topic, sentenceIndex, allSentencesByTopic]);

  if (savedTextId && !practiceItem && !currentSentence) {
    return (
      <div className="grid place-items-center p-12">
        <span className="loading loading-lg text-success"></span>
        <p className="mt-2">Chargement du texte personnalisé...</p>
      </div>
    );
  }

  if (currentSentence) {
    return (
      <TypingTest
        eclipsedTime={eclipsedTime || (practiceItem ? Infinity : 60)}
        text={currentSentence}
        language={practiceLanguage}
      />
    );
  }

  // Default/Error case: No valid text source found
  return (
    <div className="grid place-items-center p-12">
      <div className="flex flex-col items-center">
        <h1 className="mb-4 font-bold text-3xl text-center">
          {topic ? `Aucune phrase trouvée pour le sujet : ${topic}.` : "Aucun texte sélectionné pour l'entraînement."}
        </h1>
        <div className="flex items-center gap-2">
          <button onClick={() => history.back()} className="btn btn-success btn-outline">
            <ArrowLeft className="h-5 w-5" /> Retour
          </button>
          <Link to="/" className="btn btn-success btn-outline">
            <HomeIcon className="h-5 w-5" /> Aller à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};