
import { motion } from "framer-motion";
import {
  Check,
  Sparkles,
  Zap,
  Building2,
  ArrowRight,
} from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "Explore smarter document management.",
    price: "Free",
    period: "forever",
    icon: Zap,
    features: [
      "3 document uploads",
      "Basic AI summaries",
      "Limited AI questions",
      "Personal workspace",
      "Basic document search",
    ],
    button: "Get started",
    popular: false,
  },
  {
    name: "Professional",
    description: "Everything you need to work smarter.",
    price: "₹499",
    period: "per month",
    icon: Sparkles,
    features: [
      "100 document uploads",
      "Advanced AI summaries",
      "Unlimited AI questions",
      "Document comparison",
      "Source citations",
      "Priority processing",
    ],
    button: "Start with Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "Powerful tools for growing teams.",
    price: "Custom",
    period: "flexible plans",
    icon: Building2,
    features: [
      "Unlimited document uploads",
      "Advanced AI capabilities",
      "Team collaboration",
      "Centralised workspace",
      "Priority support",
      "Custom integrations",
    ],
    button: "Contact sales",
    popular: false,
  },
];

function Pricing() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden px-5 py-24 md:py-32"
    >
      
{/* Premium cinematic lighting effects */}

{/* Main purple ambient glow */}
<div className="pointer-events-none absolute left-1/2 top-[35%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-violet-700/20 blur-[150px]" />

{/* Spotlight behind the Pro pricing card */}
<div className="pointer-events-none absolute left-1/2 top-[48%] h-[350px] w-[450px] -translate-x-1/2 rounded-full bg-purple-500/25 blur-[110px]" />

{/* Diagonal violet and cyan light beam */}
<div
  className="pointer-events-none absolute -right-[12%] top-[15%] h-[110px] w-[850px] rotate-[-35deg] rounded-full opacity-80 blur-[14px]"
  style={{
    background:
      "linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.15) 20%, rgba(139,92,246,0.9) 43%, rgba(216,180,254,1) 53%, rgba(103,232,249,0.9) 62%, transparent 100%)",
  }}
/>

{/* Premium cinematic lighting effects */}

{/* Main purple ambient glow */}
<div className="pointer-events-none absolute left-1/2 top-[35%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-violet-700/20 blur-[150px]" />

{/* Spotlight behind the Pro pricing card */}
<div className="pointer-events-none absolute left-1/2 top-[48%] h-[350px] w-[450px] -translate-x-1/2 rounded-full bg-purple-500/25 blur-[110px]" />

{/* Diagonal violet and cyan light beam */}
<div
  className="pointer-events-none absolute -right-[12%] top-[15%] h-[110px] w-[850px] rotate-[-35deg] rounded-full opacity-80 blur-[14px]"
  style={{
    background:
      "linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.15) 20%, rgba(139,92,246,0.9) 43%, rgba(216,180,254,1) 53%, rgba(103,232,249,0.9) 62%, transparent 100%)",
  }}
/>


{/* Premium cinematic lighting effects */}

{/* Main purple ambient glow */}
<div className="pointer-events-none absolute left-1/2 top-[35%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-violet-700/20 blur-[150px]" />

{/* Spotlight behind the Pro pricing card */}
<div className="pointer-events-none absolute left-1/2 top-[48%] h-[350px] w-[450px] -translate-x-1/2 rounded-full bg-purple-500/25 blur-[110px]" />

{/* Diagonal violet and cyan light beam */}
<div
  className="pointer-events-none absolute -right-[12%] top-[15%] h-[110px] w-[850px] rotate-[-35deg] rounded-full opacity-80 blur-[14px]"
  style={{
    background:
      "linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.15) 20%, rgba(139,92,246,0.9) 43%, rgba(216,180,254,1) 53%, rgba(103,232,249,0.9) 62%, transparent 100%)",
  }}
/>

{/* Soft outer light reflection */}
<div
  className="pointer-events-none absolute -right-[10%] top-[13%] h-[170px] w-[900px] rotate-[-35deg] rounded-full opacity-50 blur-[45px]"
  style={{
    background:
      "linear-gradient(90deg, transparent, rgba(124,58,237,0.7), rgba(103,232,249,0.65), transparent)",
  }}
/>




      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Simple pricing
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            Plans that grow with
            <span className="block bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
              the way you work
            </span>
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-400">
            Start for free and upgrade whenever you need
            more power to understand your documents.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid items-stretch gap-7 lg:grid-cols-3">
          {plans.map((plan, index) => {
            const Icon = plan.icon;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                }}
                whileHover={{ y: -8 }}
                className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${
                  plan.popular
                    ? "border-violet-500/60 bg-violet-500/[0.08] shadow-[0_0_45px_rgba(139,92,246,0.12)]"
                    : "border-white/10 bg-white/[0.025] hover:border-white/20"
                }`}
              >

                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-violet-600 to-purple-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-violet-900/40">
                    MOST POPULAR
                  </div>
                )}

                {/* Plan heading */}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      plan.popular
                        ? "bg-violet-500/20 text-violet-300"
                        : "bg-white/5 text-slate-300"
                    }`}
                  >
                    <Icon size={22} />
                  </div>

                  <h3 className="text-xl font-bold text-white">
                    {plan.name}
                  </h3>
                </div>

                <p className="mt-5 min-h-12 text-sm leading-6 text-slate-400">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mt-7 flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight text-white">
                    {plan.price}
                  </span>
                  <span className="text-sm text-slate-500">
                    {plan.period}
                  </span>
                </div>

                <div className="my-8 h-px bg-white/10" />

                {/* Features */}
                <div className="flex-1 space-y-5">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3 text-sm text-slate-300"
                    >
                      <Check
                        size={17}
                        className="mt-0.5 shrink-0 text-violet-400"
                      />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  type="button"
                  className={`mt-10 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 ${
                    plan.popular
                      ? "bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-lg shadow-violet-900/30 hover:shadow-violet-500/30"
                      : "border border-white/15 bg-white/[0.04] text-white hover:border-violet-400/50 hover:bg-violet-500/10"
                  }`}
                >
                  {plan.button}
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Demo pricing for this portfolio project. Plans and limits are illustrative.
        </p>
      </div>
    </section>
  );
}

export default Pricing;
