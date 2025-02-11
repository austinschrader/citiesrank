// src/features/feed/components/FeedHeader.tsx
// Displays the header section of the feed, including title and description.
import { motion } from 'framer-motion';

const FeedHeader = ({ itemVariants }: { itemVariants: any }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="relative mb-16 text-center"
    >
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full blur-3xl" />
      <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Your Feed
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
        Discover places and collections tailored just for you
      </p>
    </motion.div>
  );
};

export default FeedHeader;
