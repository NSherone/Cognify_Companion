"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaDownload } from "react-icons/fa";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import * as styles from "../components/styles/ResultSheet.styles";

const ResultSheet = () => {
  const [summary, setSummary] = useState("No summary available.");
  const [methodology, setMethodology] = useState("");
  const [ideas, setIdeas] = useState("");
  const [keySections, setKeySections] = useState("");
  const [highlightedPDFUrl, setHighlightedPDFUrl] = useState("");

  const formatSummary = (summaryText: string) => {
    const cleaned = summaryText.replace(/\s+/g, " ").trim();
    return <p style={{ textAlign: "justify" }}>{cleaned}</p>;
  };

  const formatMethodology = (methodologyText: string) => {
    const sections = methodologyText.split("\n").map((line) => line.trim());
    return sections.map((line, index) => {
      line = line.replace(/\*\*/g, "");
      if (
        line.startsWith("Research Design:") ||
        line.startsWith("Data Collection Methods:") ||
        line.startsWith("Tools/Frameworks Used:")
      ) {
        return <strong key={index}>{line}</strong>;
      }
      if (line.startsWith("-")) {
        return <li key={index}>{line.replace("-", "")}</li>;
      }
      return <p key={index}>{line}</p>;
    });
  };

  const formatIdeas = (ideasText: string) => {
    const ideaLines = ideasText.split(/\n(?=\d+\.)/);
    return ideaLines.map((idea, index) => {
      idea = idea.replace(/\*\*/g, "");
      const parts = idea.split(" - ");
      return (
        <div key={index} style={{ marginBottom: "1rem" }}>
          {parts[0]}
          {parts.slice(1).map((detail, i) => (
            <p key={i}>{detail.trim()}</p>
          ))}
        </div>
      );
    });
  };

  const formatKeySections = (sectionsText: string) => {
    const sections = sectionsText.split(/\n(?=[A-Z])/);
    return sections.map((section, index) => {
      const [title, ...rest] = section.split(":");
      return (
        <div key={index} style={{ marginBottom: "0.8rem" }}>
          <strong>{title.trim()}:</strong>
          <p>{rest.join(":").trim()}</p>
        </div>
      );
    });
  };

  const downloadAsWord = () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "📄 Summary", bold: true, size: 28 }),
                new TextRun("\n" + summary + "\n\n"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "🔑 Key Sections", bold: true, size: 28 }),
                new TextRun("\n" + keySections + "\n\n"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "🧪 Methodology", bold: true, size: 28 }),
                new TextRun("\n" + methodology + "\n\n"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "💡 Research Ideas",
                  bold: true,
                  size: 28,
                }),
                new TextRun("\n" + ideas + "\n\n"),
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "Research_Analysis.docx");
    });
  };

  useEffect(() => {
    try {
      const result = localStorage.getItem("summaryResult");
      if (result) {
        const {
          summary,
          methodology,
          project_ideas,
          key_sections,
          highlighted_pdf_url,
        } = JSON.parse(result);
        setSummary(summary || "No summary available.");
        setMethodology(methodology || "");
        setIdeas(project_ideas || "");
        setKeySections(key_sections || "");
        setHighlightedPDFUrl(highlighted_pdf_url || "");
      }
    } catch (err) {
      console.error("Failed to parse summaryResult from localStorage", err);
    }
  }, []);

  return (
    <main className={styles.pageWrapper}>
      <section className={styles.section}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FaCheckCircle className="inline text-green-500 mr-2" />
          Analysis Results
        </motion.h1>

        {/* Summary */}
        <motion.div
          className={styles.resultBlock}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.resultTitle}>📄 Summary</h2>
          <div className={styles.resultText}>{formatSummary(summary)}</div>
        </motion.div>

        {/* Key Sections */}
        <motion.div
          className={styles.resultBlock}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className={styles.resultTitle}>🔑 Key Sections</h2>
          {keySections ? (
            <div className={styles.resultText}>
              {formatKeySections(keySections)}
            </div>
          ) : (
            <p className={styles.resultText}>No key sections provided.</p>
          )}
        </motion.div>

        {/* Methodology */}
        <motion.div
          className={styles.resultBlock}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className={styles.resultTitle}>🧪 Methodology</h2>
          <div className={styles.resultText}>
            {formatMethodology(methodology)}
          </div>
        </motion.div>

        {/* Research Ideas */}
        <motion.div
          className={styles.resultBlock}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className={styles.resultTitle}>💡 Research Ideas</h2>
          {ideas ? (
            <div className={styles.resultText}>{formatIdeas(ideas)}</div>
          ) : (
            <p className={styles.resultText}>No research ideas provided.</p>
          )}
        </motion.div>

        <div className={styles.buttonWrapper}>
          {highlightedPDFUrl ? (
            <motion.a
              href={`http://localhost:8000${highlightedPDFUrl}`}
              download="highlighted-paper.pdf"
              className={`${styles.downloadButton} ${styles.pdfButton}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaDownload className="mr-2" />
              Download Highlighted PDF
            </motion.a>
          ) : (
            <p className={styles.resultText}>No highlighted PDF available.</p>
          )}

          <motion.button
            onClick={downloadAsWord}
            className={`${styles.downloadButton} ${styles.wordButton}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaDownload className="mr-2" />
            Download Word Report
          </motion.button>
        </div>
      </section>
    </main>
  );
};

export default ResultSheet;
