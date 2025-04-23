// src/components/CTASection/CTASection.tsx

'use client';

import { motion } from 'framer-motion';
import * as styles from './styles/CTASection.styles';
import Link from 'next/link';

const CTASection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={styles.sectionWrapper}
    >
      <h2 className={styles.heading}>Ready to boost your research workflow?</h2>
      <p className={styles.subText}>
        Upload your paper now and let Cognify Companion summarize, categorize, and inspire new ideas for you.
      </p>
      <Link href="/upload">
        <button className={styles.button}>Get Started</button>
      </Link>
    </motion.section>
  );
};

export default CTASection;
