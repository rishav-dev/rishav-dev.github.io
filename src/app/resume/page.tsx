"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Download, ExternalLink, Printer } from "lucide-react";

/**
 * PDF at /public/resume.pdf
 */
const RESUME_FILE = "/Rishav_Chakravarty_Resume_DSA.pdf";

export default function Resume() {
  const [loadError, setLoadError] = useState(false);

  // Helpful viewer params
  const viewerSrc = useMemo(
    () => `${RESUME_FILE}#view=FitH&zoom=page-fit`,
    []
  );

  const handlePrint = () => {

    window.open(RESUME_FILE, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />

      {/* Grid Background */}
      <div className="absolute inset-0 data-grid opacity-20" />

      {/* Header */}
      <section className="relative pt-32 pb-10 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gradient mb-4">Resume</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Preview, download, or print the latest copy of my resume.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Actions */}
      <section className="relative pb-8 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href={RESUME_FILE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg glass border border-white/10 text-gray-200 hover:text-white hover:bg-white/10 transition"
            >
              <ExternalLink className="w-4 h-4" />
              Open in new tab
            </a>

            <a
              href={RESUME_FILE}
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:brightness-110 transition"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg glass border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-500/10 transition"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </motion.div>
        </div>
      </section>

      {/* Preview */}
      <section className="relative pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative group"
          >
            {/* subtle cyan/teal glow on hover */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />

            <div className="relative glass rounded-2xl p-3 md:p-5 border border-white/10 overflow-hidden">
              {/*responsive wrapper (approx 8.5x11) */}
              <div className="relative w-full" style={{ paddingTop: "129%" }}>
                <object
                  key={viewerSrc}
                  data={viewerSrc}
                  type="application/pdf"
                  className="absolute inset-0 w-full h-full"
                  onLoad={() => setLoadError(false)}
                  onError={() => setLoadError(true)}
                >
                  {/* Fallback if inline PDF isn’t supported */}
                  <div className="absolute inset-0 flex items-center justify-center p-6 text-center bg-black/20">
                    <div>
                      <p className="text-sm text-gray-300 mb-3">
                        Inline preview isn’t available in this browser.
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <a
                          href={RESUME_FILE}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass border border-white/10 text-gray-200 hover:text-white hover:bg-white/10 transition"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open in new tab
                        </a>
                        <a
                          href={RESUME_FILE}
                          download
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:brightness-110 transition"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                </object>
              </div>
            </div>
          </motion.div>

          {/* Hard error (e.g., missing file) */}
          {loadError && (
            <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm">
              Couldn’t load <span className="text-white">{RESUME_FILE}</span>. Make sure the PDF
              exists under <code className="text-white">/public</code> and the path is correct.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
