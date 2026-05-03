"use client";
import { X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

function Authentication({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClose}
          className="fixed inset-0 z-90 bg-black/50 backdrop-blur"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-100 flex items-center justify-center px-4"
          >
            <div className="relative w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 text-black shadow-[0_40px_100px_rgba(0,0,0,0.35)] sm:p-8">
              <button
                type="button"
                className="absolute right-4 top-4 text-gray-500 transition hover:text-black"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div className="mb-6 text-center">
                <h1 className="text-3xl font-extrabold tracking-widest">
                  ECHO-DISPATCH
                </h1>
                <p className="text-xs mt-1 text-gray-600">
                  Premium waste truck booking
                </p>
              </div>
              <button className="flex h-11 w-full rounded-xl border border-black items-center justify-center gap-3 text-sm font-semibold hover:bg-black hover:text-white transition-colors">
                <Image
                  src={"/google.png"}
                  alt="Google Logo"
                  width={18}
                  height={18}
                />
                Sign in with Google
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

export default Authentication;
