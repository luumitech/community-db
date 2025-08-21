'use client';
import { cn } from '@heroui/react';
import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import React from 'react';
import { useImageList } from './image-list';
import { Screenshot } from './screenshot';

interface Props {
  className?: string;
}

export const FeatureOverview: React.FC<Props> = ({ className }) => {
  const imageList = useImageList();

  return (
    <div
      className={cn(className, 'p-3 bg-green-200', 'grid grid-cols-2 gap-3')}
    >
      {imageList.map((image) => (
        <motion.div
          key={image.alt}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeIn' }}
          // viewport={{ once: true, amount: 0.5 }} // triggers once, when 50% in view
        >
          <Screenshot {...image} />
        </motion.div>
      ))}
    </div>
  );
};
