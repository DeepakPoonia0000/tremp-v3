"use client";

import { motion } from "framer-motion";

export default function ShopTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="animate-enter"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28 }}
    >
      {children}
    </motion.div>
  );
}
