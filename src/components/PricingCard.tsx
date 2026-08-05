
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";

type FeatureGroup = {
  title: string;
  items: string[];
};

type PricingCardProps = {
  name: string;
  description: string;
  features: string[];
  accent?: string;
  recommended?: boolean;
  onContact?: () => void;
  ctaText?: string;
  buttonClass?: string;
  children?: ReactNode;
  detailedFeatures?: FeatureGroup[];
};

const PricingCard = ({
  name,
  description,
  features,
  accent = "from-australis-indigo to-australis-aqua",
  recommended,
  onContact,
  ctaText = "Get in touch with the team",
  buttonClass,
  children,
  detailedFeatures = [],
}: PricingCardProps) => {
  // INDIVIDUAL expanded state per card (hidden by default)
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={
        `relative flex flex-col justify-between h-full p-8 rounded-3xl border border-white/30 bg-white/30 ` +
        `shadow-2xl shadow-australis-navy/5 backdrop-blur-xl transition-all duration-300 ` +
        (expanded ? "scale-105 ring-2 ring-australis-aqua/40 z-10" : "") +
        (recommended ? " ring-2 ring-[#3bf5b7]/50 scale-105 z-10" : "")
      }
    >
      <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl z-0 bg-gradient-to-br ${accent} opacity-30`}></div>
      <div className="relative z-10 flex flex-col h-full">
        {/* Title & MOST POPULAR inline */}
        <div className="flex items-center mb-2 gap-2">
          <h3 className="text-2xl font-bold text-australis-navy">{name}</h3>
          {recommended && (
            <div className="px-3 py-1 text-xs font-semibold bg-[#3bf5b7] text-[#3a3d5d] rounded-full shadow ml-1">
              MOST POPULAR
            </div>
          )}
        </div>
        <p className="text-gray-700 mb-4">{description}</p>
        {/* Uniform bullet points */}
        <ul className="mb-6 text-base list-disc list-inside text-australis-navy space-y-2 pl-4">
          {features.map((f, i) => (
            <li key={i} className="">{f}</li>
          ))}
        </ul>
        {children}

        {/* Primary call to action — pinned to the bottom so cards of differing
            height line their buttons up. */}
        <div className="mt-auto pt-4">
          <Button
            type="button"
            onClick={onContact}
            className={`w-full rounded-xl font-semibold transition-all duration-300 ${buttonClass ?? ""}`}
            size="lg"
          >
            {ctaText}
          </Button>
        </div>

        {/* Accordion Trigger and Content */}
        {detailedFeatures.length > 0 && (
          <>
            <button
              type="button"
              className="group flex items-center justify-center mt-6 cursor-pointer bg-transparent border-none ring-0 outline-none px-0 hover:underline focus:outline-none font-semibold text-australis-indigo transition-colors"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
            >
              <span>{expanded ? "Hide Details" : "See Details"}</span>
              <ChevronDown
                className={`ml-2 inline-block transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                size={18}
              />
            </button>
            {/* Expandable Features */}
            {expanded && (
              <div className="w-full px-1">
                <div className="py-3">
                  <div className="space-y-3">
                    {detailedFeatures.map((group, idx) => (
                      <div key={idx}>
                        <div className="font-semibold text-australis-navy/90 pb-1">{group.title}</div>
                        <ul className="pl-5 list-disc text-australis-navy/80 text-sm space-y-1">
                          {group.items.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PricingCard;
