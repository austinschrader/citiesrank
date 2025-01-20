import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ReactNode, Suspense, useState, useEffect } from "react";

interface AnimatedLayoutProps {
  children: ReactNode;
}

const LoadingFallback = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="w-full h-full flex items-center justify-center"
  >
    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
  </motion.div>
);

export const AnimatedLayout = ({ children }: AnimatedLayoutProps) => {
  const location = useLocation();
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsPending(true);
    const timer = setTimeout(() => setIsPending(false), 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: isPending ? 0.95 : 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0.95, y: 0 }}
        transition={{
          duration: 0.12,
          ease: [0.32, 0.72, 0, 1],
        }}
        className="w-full h-full"
      >
        <Suspense fallback={<LoadingFallback />}>
          <motion.div
            initial={{ opacity: 0.95 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          >
            {children}
          </motion.div>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};
