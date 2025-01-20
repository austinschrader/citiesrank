import { Dialog, DialogContent, DialogPortal } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedDialogProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  showOverlay?: boolean;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const contentVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      duration: 0.3,
      bounce: 0.15,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      type: "tween",
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

export const AnimatedDialog = ({
  children,
  isOpen,
  onClose,
  showOverlay = true,
}: AnimatedDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence mode="wait">
        {isOpen && (
          <DialogPortal forceMount>
            {showOverlay && (
              <motion.div
                className="fixed inset-0 z-50 bg-black/80"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={overlayVariants}
                transition={{ duration: 0.2 }}
              />
            )}
            <DialogContent forceMount className="border-none bg-transparent p-0 max-h-[90vh] w-full max-w-[1400px] mx-auto">
              <motion.div
                className="h-full w-full"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={contentVariants}
              >
                {children}
              </motion.div>
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
