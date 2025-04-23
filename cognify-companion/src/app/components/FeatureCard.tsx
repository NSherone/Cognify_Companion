'use client';

import { motion } from 'framer-motion';
import {
  Card,
  Icon as IconWrapper,
  Title as TitleText,
  Description as DescriptionText,
} from './styles/FeatureCard.styles';

type FeatureCardProps = {
    title: string;
    description: string;
    icon: string;
  };

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <motion.div
      className={Card}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className={IconWrapper}>{icon}</div>
      <h3 className={TitleText}>{title}</h3>
      <p className={DescriptionText}>{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
