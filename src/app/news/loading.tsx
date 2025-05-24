"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center">
      <div className="flex flex-col items-center">
        <motion.div
          className="w-16 h-16 border-4 border-muted border-t-amber-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.p
          className="mt-4 text-amber-500 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Loading the latest battle rap news...
        </motion.p>
      </div>
    </div>
  );
}
