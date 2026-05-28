import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface Toast {
  id: string;
  message: string;
}

interface ToastContainerProps {
  toasts: Toast[];
}

const toastVariants = {
  initial: { opacity: 0, x: 48, scale: 0.9 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  exit:    { opacity: 0, x: 48, scale: 0.85, transition: { duration: 0.18 } },
};

export function ToastContainer({ toasts }: ToastContainerProps) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <AnimatePresence initial={false}>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            layout
            variants={toastVariants}
            initial='initial'
            animate='animate'
            exit='exit'
            style={{
              background: '#333',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              fontSize: '0.9rem',
            }}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}