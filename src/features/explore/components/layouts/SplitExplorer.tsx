/**
 * Layout component that manages split view between map and panels.
 * Pure layout component - handles only view composition and sizing.
 *
 * Data flow: MapContext -> SplitExplorer -> Panel components
 */
import { ContentPanel } from "@/features/explore/components/ui/ContentPanel";
import { FiltersBar } from "@/features/explore/components/ui/FiltersBar";
import { CityMap } from "@/features/map/components/CityMap";
import { useMap } from "@/features/map/context/MapContext";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Split from "react-split";

export const SplitExplorer = () => {
  const { splitMode } = useMap();

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <FiltersBar />
      <div className="flex-1 overflow-hidden">
        {/* Mobile View */}
        <div className="md:hidden h-full">
          {splitMode === "list" ? (
            <AnimatePresence mode="wait">
              <motion.div
                key="content"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={cn(
                  "h-full",
                  "bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm",
                  "overflow-hidden rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50",
                  "hover:border-purple-200/50 dark:hover:border-purple-700/50",
                  "relative"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-gray-900/50" />
                <div className="relative z-10 h-full">
                  <ContentPanel />
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              key="map"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="h-full rounded-lg overflow-hidden relative"
            >
              <CityMap />
            </motion.div>
          )}
        </div>

        {/* Desktop Split View */}
        <div className="hidden md:block h-full">
          <Split
            className={cn(
              "h-full flex",
              "split-wrapper",
              "[&>.gutter]:bg-gradient-to-b [&>.gutter]:from-gray-200 [&>.gutter]:to-gray-300",
              "[&>.gutter]:dark:from-gray-700 [&>.gutter]:dark:to-gray-800",
              "[&>.gutter]:transition-colors [&>.gutter]:duration-300",
              "[&>.gutter]:hover:from-purple-200 [&>.gutter]:hover:to-purple-300",
              "[&>.gutter]:dark:hover:from-purple-800 [&>.gutter]:dark:hover:to-purple-900",
              "[&>.gutter]:backdrop-blur-sm"
            )}
            sizes={splitMode === "list" ? [100, 0] : splitMode === "map" ? [0, 100] : [50, 50]}
            minSize={0}
            gutterSize={6}
            snapOffset={50}
            dragInterval={1}
          >
            <div
              className={cn(
                "transition-all duration-300 ease-in-out",
                splitMode === "list" ? "flex-1" : splitMode === "map" ? "w-0" : "flex-1",
                splitMode === "map" && "hidden"
              )}
            >
              <AnimatePresence mode="wait">
                {splitMode !== "map" && (
                  <motion.div
                    key="content"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={cn(
                      "h-full",
                      "bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm",
                      "overflow-hidden rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50",
                      "hover:border-purple-200/50 dark:hover:border-purple-700/50",
                      "relative"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-gray-900/50" />
                    <div className="relative z-10 h-full">
                      <ContentPanel />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              className={cn(
                "transition-all duration-300 ease-in-out",
                splitMode === "map" ? "flex-1" : splitMode === "list" ? "w-0" : "flex-1",
                splitMode === "list" && "hidden"
              )}
            >
              <motion.div
                key={`map-${splitMode}`}
                variants={contentVariants}
                initial="visible"
                animate={splitMode !== "list" ? "visible" : "hidden"}
                className="h-full rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
              >
                <CityMap />
              </motion.div>
            </div>
          </Split>
        </div>
      </div>
    </motion.div>
  );
};
