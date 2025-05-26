import { ChangeEvent, useState } from "react";
import { useSentenceStore } from "./store/sentenceStore";
import { Link, useNavigate } from "@tanstack/react-router"; // Import useNavigate

export default function App() {
  const [selectedTopic, setSelectedTopic] = useState('computer_science');
  const [eclipsedTime, setEclipsedTime] = useState(60);
  const navigate = useNavigate(); // Hook for navigation

  const { getAllTopics, getSentencesByTopic } = useSentenceStore(); // Add getSentencesByTopic
  const topics = getAllTopics();
  // We don't need all sentences here anymore for this specific logic
  // const { sentences } = useSentenceStore() 

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedTopic(value);
  };

  const handleEclipsedChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setEclipsedTime(parseInt(value));
  };

  const handleStartPractice = () => {
    if (!selectedTopic) {
      // Maybe show an alert or handle this case
      console.warn("No topic selected");
      return;
    }
    const sentencesForSelectedTopic = getSentencesByTopic(selectedTopic);
    if (sentencesForSelectedTopic && sentencesForSelectedTopic.length > 0) {
      const randomIndex = Math.floor(Math.random() * sentencesForSelectedTopic.length);
      navigate({
        to: '/practice',
        search: {
          topic: selectedTopic,
          eclipsedTime: eclipsedTime,
          sentenceIndex: randomIndex, // Pass the chosen index
        },
      });
    } else {
      // Handle case where no sentences are found for the topic
      console.warn(`No sentences found for topic: ${selectedTopic}`);
      // Optionally navigate to practice page with an error or show alert here
      navigate({
        to: '/practice',
        search: { // Still navigate so user sees the "no sentences found" message on practice page
          topic: selectedTopic,
          eclipsedTime: eclipsedTime,
        }
      })
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 p-12 py-48">
        <div className="flex items-center gap-2">
          <select value={selectedTopic} onChange={handleSelectChange} className="select select-success w-full">
            <option value="" disabled>Choisissez votre sujet préféré</option>
            {/* Assuming sentenceStore provides all sentences to derive counts if needed */}
            {/* For direct counts, sentenceStore might need an enhancement or do it here */}
            {topics.map(topic => (
              <option key={topic} value={topic}>{topic} ({getSentencesByTopic(topic).length})</option> // Display count
            ))}
          </select>

          <select value={eclipsedTime} onChange={handleEclipsedChange} className="select select-success w-full">
            <option value={60}>60 secondes</option>
            <option value={120}>120 secondes</option>
            <option value={0}>Infini</option>
          </select>
        </div>

        {/* Changed Link to a button with onClick handler */}
        <button onClick={handleStartPractice} className="btn btn-active w-full btn-success">
          Commencer l'entraînement
        </button>

        <div className="flex items-center gap-2 justify-between w-full">
          <Link className="w-full" to='/saved-text'>
            <button className="btn w-full">Textes Sauvegardés</button>
          </Link>
          <Link className="w-full" to='/custom-text'>
            <button className="btn w-full">Créer un Texte Personnalisé</button>
          </Link>
        </div>
      </div>
    </>
  );
}