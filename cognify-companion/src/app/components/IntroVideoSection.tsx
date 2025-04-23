// src/components/IntroVideoSection/IntroVideoSection.tsx

'use client';

import { motion } from 'framer-motion';
import * as styles from './styles/IntroVideoSection.styles';

const IntroVideoSection = () => {
  return (
    <section className={styles.section}>
      <motion.h2
        className={styles.title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        See Cognify Companion in Action
      </motion.h2>

      <motion.p
        className={styles.subtitle}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Watch how easily you can upload your paper, analyze it, and extract insights instantly.
      </motion.p>

      <motion.div
        className={styles.videoWrapper}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with your actual demo link
          title="Demo Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </motion.div>
    </section>
  );
};

export default IntroVideoSection;
