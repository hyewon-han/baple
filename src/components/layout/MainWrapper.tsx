import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  children: ReactNode;
}

const MainWrapper = ({ children }: Props) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className='w-[90%] md:max-w-[1275px] m-auto mt-4'>{children}</div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MainWrapper;
