"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaFilePdf } from "react-icons/fa";
import * as styles from "../components/styles/UploadPage.styles";
import * as uploaderStyles from "../components/styles/FileUploader.styles";
import * as taskStyles from "../components/styles/TaskSelector.styles";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [tasks, setTasks] = useState<string[]>([
    "Summarize",
    "Extract Methodology",
    "Generate Research Ideas",
  ]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTip, setCurrentTip] = useState<string>("");
  const router = useRouter();

  const tips = [
    "Tip: Make sure your PDF is clear for better results.",
    "Tip: Avoid complex formatting in your document for accurate analysis.",
    "Tip: Select only relevant tasks for faster processing.",
    "Tip: Use structured text for best summarization results.",
    "Tip: Double-check the content before uploading for better quality insights.",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  const toggleTask = (task: string) => {
    if (task === "Summarize") return;
    setTasks((prev) =>
      prev.includes(task) ? prev.filter((t) => t !== task) : [...prev, task]
    );
  };

  const handleAnalyze = async () => {
    if (!file) return alert("Please upload a file first.");

    setLoading(true);
    setIsProcessing(true);
    setProgress(0);

    const tipInterval = setInterval(() => {
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      setCurrentTip(randomTip);
    }, 4000);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const totalStages =
        1 +
        (tasks.includes("Extract Methodology") ? 1 : 0) +
        (tasks.includes("Generate Research Ideas") ? 1 : 0);
      let completedStages = 0;

      const updateProgress = (stageProgress: number) => {
        const baseProgress = (completedStages / totalStages) * 100;
        const stageContribution = (1 / totalStages) * stageProgress;
        setProgress(baseProgress + stageContribution);
      };

      for (let i = 0; i <= 10; i++) {
        await new Promise((r) => setTimeout(r, 100));
        updateProgress(i * 0.2);
      }

      const summaryPromise = fetch("http://localhost:8000/summarize-pdf/", {
        method: "POST",
        body: formData,
      });

      let apiCallFinished = false;
      summaryPromise.then(() => {
        apiCallFinished = true;
      });

      // Simulate progress during API call with variable speed
      for (let i = 11; i <= 100; i++) {
        if (apiCallFinished) break;
        let delay = 100;
        if (i < 30) delay = 150 - i * 2;
        else if (i > 70) delay = 90 + (i - 70) * 2;
        else delay = 90;

        await new Promise((r) => setTimeout(r, delay));
        updateProgress(i);
      }

      const summaryRes = await summaryPromise;
      if (!summaryRes.ok) throw new Error("Summarization failed");

      const {
        summary,
        highlighted_pdf_url,
        methodology,
        key_sections,
        project_ideas,
      } = await summaryRes.json();
      completedStages++;
      updateProgress(100);

      // If methodology extraction is selected
      if (tasks.includes("Extract Methodology")) {
        for (let i = 0; i <= 100; i++) {
          let delay = 100;
          if (i < 30) delay = 150 - i * 2;
          else if (i > 70) delay = 90 + (i - 70) * 2;
          else delay = 90;

          await new Promise((r) => setTimeout(r, delay));
          updateProgress(i);
        }
        completedStages++;
      }

      if (tasks.includes("Generate Research Ideas")) {
        // Simulate progress with similar variable speed
        for (let i = 0; i <= 100; i++) {
          let delay = 100;
          if (i < 30) delay = 150 - i * 2;
          else if (i > 70) delay = 90 + (i - 70) * 2;
          else delay = 90;

          await new Promise((r) => setTimeout(r, delay));
          updateProgress(i);
        }
        completedStages++;
      }

      // Save all results to localStorage
      localStorage.setItem(
        "summaryResult",
        JSON.stringify({
          summary,
          highlighted_pdf_url,
          methodology,
          key_sections,
          project_ideas,
        })
      );

      clearInterval(tipInterval);
      setIsProcessing(false);
      setLoading(false);
      router.push("/result");
    } catch (err) {
      console.error(err);
      alert("Something went wrong during analysis.");
      clearInterval(tipInterval);
      setIsProcessing(false);
      setLoading(false);
    }
  };

  // Rest of your component remains exactly the same...
  return (
    <main className={styles.pageWrapper}>
      <section className={styles.section}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Upload Your Research Paper</h1>
          <p className={styles.subtitle}>
            Choose tasks and get instant insights powered by AI.
          </p>
        </div>

        <motion.div
          className={uploaderStyles.wrapper}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <label className={uploaderStyles.uploadBox}>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            {file ? (
              <p className="text-indigo-600 font-medium text-center">
                {file.name}
              </p>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <FaFilePdf size={36} className="text-red-500 mb-2" />
                <p>Drag and drop your PDF here, or click to select</p>
              </div>
            )}
          </label>
        </motion.div>

        <motion.div
          className={taskStyles.wrapper}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {["Summarize", "Extract Methodology", "Generate Research Ideas"].map(
            (task) => (
              <motion.div
                key={task}
                className={`${taskStyles.taskItem} ${
                  tasks.includes(task)
                    ? "border-2 border-indigo-600"
                    : "border border-gray-300 dark:border-gray-600"
                } flex items-center`}
                whileTap={{ scale: task === "Summarize" ? 1 : 0.95 }}
                onClick={() => toggleTask(task)}
              >
                <input
                  type="checkbox"
                  checked={tasks.includes(task)}
                  disabled={task === "Summarize"}
                  className="mr-2 accent-indigo-600"
                  onChange={() => toggleTask(task)}
                />
                <span className={task === "Summarize" ? "font-semibold" : ""}>
                  {task} {task === "Summarize" && "(required)"}
                </span>
              </motion.div>
            )
          )}
        </motion.div>

        <motion.button
          className={styles.ctaButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Paper"}
        </motion.button>

        {isProcessing && (
          <div className="mt-8">
            <p className="text-center text-xl font-medium">Summarizing...</p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-8"
            >
              <p className="text-center text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                ⏳ Deep Analysis in Progress ⏳
              </p>
              <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-6 max-w-xl mx-auto">
                Great things take time — and your research deserves no less.
                We're carefully analyzing your paper to extract meaningful
                insights. This process might take a few moments, but it’s a
                valuable investment in uncovering impactful results.
              </p>
            </motion.div>
            <div className="relative pt-1">
              <div className="flex mb-2">
                <div
                  className="w-full bg-gray-200 rounded-full"
                  style={{
                    height: "6px",
                    backgroundColor: "#e5e7eb",
                  }}
                >
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{
                      width: `${progress}%`,
                      transition: "width 0.1s ease-in-out",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">{currentTip}</p>
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-4 rounded-lg shadow">
          <p className="text-sm text-center">
            📌 Please upload a clear PDF file. All processing happens securely
            and privately.
          </p>
        </div>
      </section>
    </main>
  );
};

export default UploadPage;
