'use client';
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  heroContainer,
  titleStyle,
  subtitleStyle,
  buttonStyle,
} from "./styles/hero-section.styles";
import heroIllustration from './images/hero-illustration.png'

const HeroSection = () => {
  return (
    <section className={heroContainer}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center md:text-left"
      >
        <h1 className={titleStyle}>Cognify Campanion</h1>
        <p className={subtitleStyle}>
          Smart Summarization, Categorization, and Idea Generation for Research
          Papers.
        </p>
        <Link href="./upload">
          <motion.button whileHover={{ scale: 1.05 }} className={buttonStyle}>
            Get Started
          </motion.button>
        </Link>
      </motion.div>

      <motion.div
        className="mt-10 md:mt-0"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <Image
          src={heroIllustration}
          alt="AI Analyzing Research Paper"
          width={500}
          height={300}
          className="dark:invert"
        ></Image>
      </motion.div>
    </section>
  );
};

export default HeroSection;
