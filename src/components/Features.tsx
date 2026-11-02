
import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquareText,
  FileText,
  Search,
  Files,
  BookOpenCheck,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: MessageSquareText,
    title: "AI Document Chat",
    description:
      "Ask questions about your documents and receive intelligent answers in seconds.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: FileText,
    title: "Smart Summaries",
    description:
      "Turn lengthy documents into clear, concise and meaningful summaries.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Search,
    title: "Instant Search",
    description:
      "Find important information across multiple documents without manual reading.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Files,
    title: "Document Comparison",
    description:
      "Compare multiple documents and discover important differences instantly.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  {
    icon: BookOpenCheck,
    title: "Source Citations",
    description:
      "Understand where each answer comes from with references to original pages.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Private Workspace",
    description:
      "Organize your files in a secure workspace with controlled access.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

function Features() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  return (
    <section
      id="features"
      className="relative px-5 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Powerful capabilities
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            Everything you need to
            <span className="block bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
              understand your documents
            </span>
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-400">
            Discover a smarter way to work with information.
            Let AI handle the reading while you focus on what matters.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isSelected = selectedCard === index;

            return (
              <motion.div
                key={feature.title}
                onClick={() => setSelectedCard(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedCard(index);
                  }
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                whileHover={{ y: -7, scale: 1.01 }}
                className={`group cursor-pointer rounded-2xl bg-white/[0.025] p-7 transition-all duration-300 ${
                  isSelected
                    ? "border-[3px] border-white shadow-[0_0_10px_rgba(255,255,255,0.8),0_0_25px_rgba(255,255,255,0.35)]"
                    : "border border-white/10 hover:border-violet-400/40 hover:bg-violet-500/[0.06]"
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg}`}
                >
                  <Icon size={23} className={feature.color} />
                </div>

                <h3 className="mt-7 text-lg font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {feature.description}
                </p>

                <div className="mt-6 h-px w-0 bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500 group-hover:w-full" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;
