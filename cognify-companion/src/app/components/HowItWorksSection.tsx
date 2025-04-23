'use client';
import { styles } from './styles/HowItWorksSection.styles'
import { FaFileAlt, FaRobot, FaLightbulb } from 'react-icons/fa';

const steps = [
  {
    icon: <FaFileAlt size={32} />,
    title: 'Upload your paper',
    description: 'Submit your research paper in PDF format quickly and securely.',
  },
  {
    icon: <FaRobot size={32} />,
    title: 'Let AI do the work',
    description: 'Our AI summarizes, extracts methodology, and analyzes content.',
  },
  {
    icon: <FaLightbulb size={32} />,
    title: 'Explore new ideas',
    description: 'Get innovative research ideas based on your paper’s content.',
  },
];

const HowItWorksSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>How It Works</h2>
        <div className={styles.stepsWrapper}>
          {steps.map((step, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.iconWrapper}>{step.icon}</div>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.description}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
