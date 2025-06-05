import { RepeatIcon, DownloadCloudIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface CharacterStat {
  character: string;
  totalCount: number;
  errorCount: number;
}

// Helper function to generate SHA-256 hash
async function generateSha256Hash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export default function Result({
  accuracy,
  cpm,
  originalText,
  userInput,
  duration, // Add duration to props
}: {
  accuracy: number;
  cpm: number;
  originalText: string;
  userInput: string;
  duration: number; // Add duration type
}) {
  const [charStats, setCharStats] = useState<CharacterStat[]>([]);
  const [textHash, setTextHash] = useState<string>("");
  const [displayedTimestamp, setDisplayedTimestamp] = useState<string>("");
  const [cipCode, setCipCode] = useState<string>("");
  const [totalErrors, setTotalErrors] = useState<number>(0); // Add totalErrors state
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (!certificateRef.current || !/^[A-Z]{4}\d{4}$/.test(cipCode)) {
      console.error("Certificate element not found or CIP is invalid.");
      // It might be good to also provide user feedback here, e.g., an alert.
      // For now, the console error is the primary feedback as per existing code.
      return;
    }

    try {
      // It's important that certificateRef.current is not null here.
      // The initial check should suffice, but defensive coding might add another one if needed.
      // For this task, assume certificateRef.current is valid if we pass the first guard.
      const canvas = await html2canvas(certificateRef.current!, { scale: 2 }); // Added non-null assertion for certificateRef.current as it's checked above.
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`TypingCertificate-${cipCode}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again or check the console for more details if the issue persists.");
    }
  };

  useEffect(() => {
    // Calculate character statistics and total errors
    const stats: Record<string, { totalCount: number; errorCount: number }> = {};
    let currentTotalErrors = 0;
    const len = Math.max(originalText.length, userInput.length);

    for (let i = 0; i < len; i++) {
      const originalChar = originalText[i];
      const userChar = userInput[i];

      if (originalChar) {
        if (!stats[originalChar]) {
          stats[originalChar] = { totalCount: 0, errorCount: 0 };
        }
        stats[originalChar].totalCount++;
        if (originalChar !== userChar && userChar !== undefined) {
          stats[originalChar].errorCount++;
          currentTotalErrors++;
        }
      } else if (userChar !== undefined) { // Extra characters typed by user
        currentTotalErrors++;
      }
    }
    setTotalErrors(currentTotalErrors); // Set total errors

    const sortedStats = Object.entries(stats)
      .map(([character, counts]) => ({
        character,
        totalCount: counts.totalCount,
        errorCount: counts.errorCount,
      }))
      .sort((a, b) => a.character.localeCompare(b.character));

    setCharStats(sortedStats);

    const now = new Date();
    const formattedTimestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setDisplayedTimestamp(formattedTimestamp);

    const textWithDateTimeForHash = `${originalText} [${now.toISOString()}]`;
    generateSha256Hash(textWithDateTimeForHash).then(setTextHash);
  }, [originalText, userInput]); // duration is not needed here as it's a fixed value post-test

  let status: string;
  let emoji: string;

  if (accuracy >= 90 && cpm >= 60) {
    status = "Excellent !";
    emoji = "🎉";
  } else if (accuracy >= 80 && cpm >= 50) {
    status = "Beau travail !";
    emoji = "👍";
  } else if (accuracy >= 70 && cpm >= 40) {
    status = "Bel effort !";
    emoji = "😊";
  } else {
    status = "Continuez à vous entraîner !";
    emoji = "💪";
  }

  return (
    <>
      {/* Re-add Hidden div for PDF generation */}
      <div
        ref={certificateRef}
        style={{
          position: "absolute",
          left: "-9999px",
          width: "800px",
          padding: "40px",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#ffffff",
          color: "#000000",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#2c3e50" }}>
            Certificate of Completion
          </h1>
        </div>
        <div style={{ fontSize: "18px", lineHeight: "1.8" }}>
          <p><strong>Name:</strong> User Name (Placeholder)</p>
          {/* Ensure this element has an ID for direct manipulation if needed */}
          <p><strong>CIP:</strong> <span id="cert-cip">{cipCode}</span></p>
          {/* Ensure this element has an ID for direct manipulation */}
          <p><strong>Date of Test Completion:</strong> <span id="cert-date-of-completion">{displayedTimestamp}</span></p>
          <hr style={{ margin: "20px 0", borderColor: "#bdc3c7" }} />
          <p><strong>Typing Speed (CPM):</strong> {cpm}</p>
          <p><strong>Accuracy:</strong> {accuracy}%</p>
          <p><strong>Duration:</strong> <span id="cert-duration">{duration} seconds</span></p>
          <p><strong>Errors:</strong> <span id="cert-errors">{totalErrors}</span></p>
          <hr style={{ margin: "20px 0", borderColor: "#bdc3c7" }} />
          <p style={{ fontSize: "14px", wordBreak: "break-all" }}>
            <strong>Test Integrity Hash (SHA-256):</strong> {textHash}
          </p>
        </div>
        <div style={{ marginTop: "50px", textAlign: "center", fontSize: "12px", color: "#7f8c8d" }}>
          <p>This certificate confirms the successful completion of the typing test.</p>
          <p>Generated by TypingTest App</p>
        </div>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
        <section className="p-6 w-full md:w-3/4 lg:w-1/2 rounded-lg flex flex-col gap-4 bg-success text-slate-50 shadow-xl">
          <div className="text-center">
          <div className="text-5xl mb-2">{emoji}</div>
          <div className="text-3xl font-semibold">{status}</div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-lg">
          <div className="bg-success-content bg-opacity-20 p-3 rounded">
            Précision : <span className="font-bold">{accuracy}%</span>
          </div>
          <div className="bg-success-content bg-opacity-20 p-3 rounded">
            CPM : <span className="font-bold">{cpm}</span>
          </div>
        </div>
        <div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-success-content bg-opacity-30 hover:bg-opacity-40 p-3 flex items-center justify-center gap-2 rounded border border-success-content text-lg"
          >
            <RepeatIcon className="w-5 h-5" />
            Recommencer l'entraînement
          </button>
        </div>
      </section>

      <section className="p-6 w-full md:w-3/4 lg:w-1/2 rounded-lg bg-base-200 dark:bg-base-300 shadow-xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Performance détaillée des caractères
        </h2>
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Intégrité du texte d'entraînement</h3>
          <p className="text-sm text-base-content dark:text-gray-400">
            Hachage SHA-256 du texte original (horodaté) :
          </p>
          <p className="font-mono text-xs break-all bg-base-100 dark:bg-base-200 p-2 rounded">
            {textHash || "Calcul en cours..."}
          </p>
          <p className="text-xs text-base-content dark:text-gray-500 mt-1">
            Test terminé le : {displayedTimestamp || "Horodatage non disponible"}
          </p>
        </div>
        <div className="overflow-x-auto max-h-96 mt-4">
          <table className="table table-zebra table-pin-rows w-full">
            <thead>
              <tr>
                <th className="text-base">Caractère</th>
                <th className="text-base text-center">Nombre total</th>
                <th className="text-base text-center">Nombre d'erreurs</th>
              </tr>
            </thead>
            <tbody>
              {charStats.map((stat) => (
                <tr key={stat.character}>
                  <td className="font-mono text-lg">
                    {stat.character === " " ? "[Espace]" : stat.character}
                    {stat.character === "\n" ? "[Saut de ligne]" : ""}
                    {stat.character === "\t" ? "[Tabulation]" : ""}
                  </td>
                  <td className="text-center text-lg">{stat.totalCount}</td>
                  <td
                    className={`text-center text-lg font-semibold ${
                      stat.errorCount > 0 ? "text-error" : "text-success"
                    }`}
                  >
                    {stat.errorCount}
                  </td>
                </tr>
              ))}
              {charStats.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center">
                    Aucune donnée de caractère à afficher.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Re-add CIP input and Download button section */}
      <section className="p-6 w-full md:w-3/4 lg:w-1/2 rounded-lg bg-base-200 dark:bg-base-300 shadow-xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Télécharger l'attestation
        </h2>
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Code CIP (ex: ABCD1234)</span>
          </label>
          <input
            type="text"
            placeholder="Entrez votre CIP (ex: ABCD1234)"
            className="input input-bordered w-full"
            value={cipCode}
            onChange={(e) => setCipCode(e.target.value.toUpperCase())}
            maxLength={8}
          />
          {cipCode && !/^[A-Z]{4}\d{4}$/.test(cipCode) && (
            <label className="label">
              <span className="label-text-alt text-error">
                Le code CIP doit contenir 4 lettres suivies de 4 chiffres.
              </span>
            </label>
          )}
        </div>
        <button
          onClick={handleDownloadPdf}
          className="btn btn-primary w-full text-lg flex items-center justify-center gap-2"
          disabled={!/^[A-Z]{4}\d{4}$/.test(cipCode)}
        >
          <DownloadCloudIcon className="w-5 h-5" />
          Télécharger l'attestation
        </button>
      </section>
    </div>
    </>
  );
}