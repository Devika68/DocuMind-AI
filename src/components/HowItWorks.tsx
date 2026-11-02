
import { useState } from "react";
import { motion } from "framer-motion";
import {
  UploadCloud,
  BrainCircuit,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Upload your documents",
    description:
      "Simply upload your PDF documents. Our workspace keeps your files organised and ready for analysis.",
    icon: UploadCloud,
    color: "text-violet-400",
    background: "bg-violet-500/10",
  },
  {
    number: "02",
    title: "Let AI understand",
    description:
      "DocuMind AI processes your content and makes important information easier to discover.",
    icon: BrainCircuit,
    color: "text-cyan-400",
    background: "bg-cyan-500/10",
  },
  {
    number: "03",
    title: "Discover insights",
    description:
      "Ask questions, explore summaries and get answers supported by document references.",
    icon: Lightbulb,
    color: "text-amber-400",
    background: "bg-amber-500/10",
  },
];

function HowItWorks() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  return (
    <section
      id="how-it-works"
      className="relative px-5 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-20 max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Simple workflow
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            From documents to
            <span className="block bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
              meaningful insights
            </span>
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-400">
            Three simple steps to transform the way you
            interact with information.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isSelected = selectedCard === index;

            return (
              <motion.div
                key={step.number}
                onClick={() => setSelectedCard(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedCard(index);
                  }
                }}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                }}
                whileHover={{ y: -8 }}
                className={`group relative cursor-pointer rounded-2xl bg-white/[0.025] p-8 transition-all duration-300 ${
                  isSelected
                    ? "border-[3px] border-white shadow-[0_0_10px_rgba(255,255,255,0.8),0_0_25px_rgba(255,255,255,0.35)]"
                    : "border border-white/10 hover:border-violet-400/40 hover:bg-violet-500/[0.05]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${step.background}`}
                  >
                    <Icon size={27} className={step.color} />
                  </div>

                  <span className="text-4xl font-bold text-white/[0.07]">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-8 text-xl font-semibold text-white">
                  {step.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-400">
                  {step.description}
                </p>

                <div className="mt-8 flex items-center gap-2 text-sm font-medium text-violet-400">
                  Step {step.number}
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-2"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
