"use client";

import FeatureCard from "./FeatureCard";
import { motion } from "framer-motion";
import {
  Section,
  Wrapper,
  Heading,
  Subheading,
  Grid,
} from "./styles/FeaturesSection.styles";

const FeaturesSection=()=> {
  const features = [
    {
      title: "Accurate Summarization",
      description:
        "Get concise, context-aware summaries of your research papers using state-of-the-art NLP models.",
      icon: "✅",
    },
    {
      title: "Research Method Extraction",
      description:
        "Automatically extract methodologies used in the paper with clarity and precision.",
      icon: "📑",
    },
    {
      title: "Idea Generation Engine",
      description:
        "Leverage AI to brainstorm fresh research ideas based on the uploaded paper’s content.",
      icon: "💡",
    },
  ];

  return (
    <section className={Section}>
      <div className={Wrapper}>
        <h2 className={Heading}>Powerful Features for Researchers</h2>
        <p className={Subheading}>
          Unlock deeper insights and accelerate your research process with our
          AI-powered tools.
        </p>

        <motion.div
          className={Grid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturesSection;
