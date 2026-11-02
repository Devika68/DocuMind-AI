
import { motion } from "framer-motion";
import {
  BrainCircuit,
  Code2,
  Users,
  Globe,
  ArrowUpRight,
  Heart,
} from "lucide-react";

function Footer() {
  const socialLinks = [
    { icon: Code2, label: "GitHub" },
    { icon: Users, label: "LinkedIn" },
    { icon: Globe, label: "Twitter" },
  ];

  const productLinks = [
    ["Features", "#features"],
    ["How it works", "#how-it-works"],
    ["Pricing", "#pricing"],
  ];

  const resourceLinks = [
    "Documentation",
    "Help Center",
    "Privacy Policy",
    "Terms of Service",
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#080914] px-5 pb-8 pt-20">

      {/* Background glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* Main footer */}
        <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand section */}
          <div className="lg:col-span-2">

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-900/30">
                <BrainCircuit size={24} className="text-white" />
              </div>

              <span className="text-2xl font-bold tracking-tight text-white">
                DocuMind
                <span className="text-violet-400"> AI</span>
              </span>
            </motion.div>

            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
              Transform the way you work with documents.
              Discover insights, ask questions and understand
              information with intelligent AI assistance.
            </p>

            {/* Social links */}
            <div className="mt-7 flex gap-3">
              {socialLinks.map(({ icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href="#"
                  aria-label={label}
                  onClick={(event) => event.preventDefault()}
                  whileHover={{ y: -4, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition-colors duration-300 hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-white"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="mb-6 text-sm font-semibold text-white">
              Product
            </h3>

            <div className="space-y-4">
              {productLinks.map(([label, link]) => (
                <a
                  key={label}
                  href={link}
                  className="group flex w-fit items-center gap-2 text-sm text-slate-400 transition-colors hover:text-violet-300"
                >
                  {label}

                  <ArrowUpRight
                    size={13}
                    className="opacity-0 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-6 text-sm font-semibold text-white">
              Resources
            </h3>

            <div className="space-y-4">
              {resourceLinks.map((label) => (
                <span
                  key={label}
                  className="block w-fit cursor-default text-sm text-slate-400"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom footer */}
        <div className="flex flex-col items-center justify-between gap-5 pt-8 text-center sm:flex-row sm:text-left">

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} DocuMind AI. All rights reserved.
          </p>

          <p className="flex items-center gap-1 text-xs text-slate-500">
            Crafted with
            <Heart
              size={13}
              className="fill-pink-500 text-pink-500"
            />
            for smarter document experiences.
          </p>

          <button
            type="button"
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="text-xs font-medium text-violet-400 transition-colors hover:text-violet-300"
          >
            Back to top ↑
          </button>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
