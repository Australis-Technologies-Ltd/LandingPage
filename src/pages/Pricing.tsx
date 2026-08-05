
import PricingCard from "@/components/PricingCard";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Remove "price" from all tier definitions and update ctaText.
const tiers = [
  {
    name: "Scout",
    description:
      "For freelancers, consultants, and small teams doing initial site screening. Billed annually.",
    accent: "from-australis-aqua to-australis-indigo",
    features: [
      "Includes 1 User Seat",
      "Includes 10 Assessment Credits / month",
      "Full access to the Design Engine",
      "Basic Regulatory Insights (National Policy)",
      "Standard Grid Proximity Analysis",
      "Standard Email Support (48hr response)",
      "Option to purchase top-up credit packs"
    ],
    detailedFeatures: [
      {
        title: "Core Platform Access",
        items: [
          "Access all key site assessment tools",
          "Fast onboarding for small teams",
        ],
      },
      {
        title: "Credits & Scaling",
        items: [
          "10 renewable site assessment credits per month",
          "Top up anytime as needed"
        ]
      },
      {
        title: "Support",
        items: [
          "Standard email support (48hr response time)",
          "Knowledge base access"
        ]
      }
    ],
    ctaText: "Get in touch with the team",
    buttonClass:
      "bg-white text-australis-navy border border-australis-navy hover:bg-australis-navy hover:text-white transition-colors",
  },
  {
    name: "Developer",
    description:
      "For growing solar developers and IPPs managing an active and complex pipeline. Billed annually.",
    accent: "from-australis-indigo to-australis-aqua",
    features: [
      "Includes 5 User Seats",
      "Includes 50 Assessment Credits / month",
      "All features of Scout, plus:",
      "Agentic AI Regulatory Compliance Engine (local plan analysis)",
      "Full Grid Insights for connection feasibility",
      "Customisable Developability Index Scoring",
      "Advanced Reporting & Data Exports",
      "Priority Support (Chat & Email, <24hr response)",
      "Option to purchase top-up credit packs"
    ],
    detailedFeatures: [
      {
        title: "All Scout Features",
        items: [
          "Everything in the Scout plan",
        ],
      },
      {
        title: "Advanced Analysis",
        items: [
          "Agentic AI-driven regulatory checks for local plans",
          "Comprehensive grid feasibility insights with high fidelity",
          "Customisable scoring for site developability",
        ],
      },
      {
        title: "Collaboration & Exports",
        items: [
          "5 team members with simultaneous access",
          "Generate detailed reports and structured data exports"
        ]
      },
      {
        title: "Support & Scaling",
        items: [
          "Priority chat/email support (<24hr response)",
          "Top up credits any time"
        ]
      }
    ],
    recommended: true,
    ctaText: "Get in touch with the team",
    buttonClass:
      "bg-australis-indigo text-white hover:bg-white hover:text-australis-indigo border border-australis-indigo transition-colors",
  },
  {
    name: "Enterprise",
    description:
      "A tailored solution for large developers, funds, and organisations requiring scale and integration.",
    accent: "from-australis-indigo to-australis-navy",
    features: [
      "Custom User Seats",
      "Custom/Pooled Annual Credits",
      "All Developer features, plus:",
      "Negotiate API Access for system integration",
      "Single Sign-On (SSO) & Security Enhancements",
      "Portfolio-Wide Analytics Dashboard",
      "Dedicated Account Manager & Onboarding",
      "Guaranteed Support SLA"
    ],
    detailedFeatures: [
      {
        title: "Scale & Integration",
        items: [
          "Flexible user seat arrangements to fit your teams",
          "Pooled or custom annual credit allocation"
        ]
      },
      {
        title: "Advanced Features",
        items: [
          "All Developer plan features",
          "Real-time API access and integration options",
          "Portfolio analytics for large asset bases"
        ]
      },
      {
        title: "Security & Support",
        items: [
          "Single Sign-On (SSO), enhanced security options",
          "Dedicated account manager and tailored onboarding",
          "Guaranteed SLA for enterprise support"
        ]
      }
    ],
    ctaText: "Get in touch with the team",
    buttonClass:
      "bg-black text-white hover:bg-white hover:text-black border border-black transition-colors",
  }
];

const Pricing = () => {
  const navigate = useNavigate();

  // Every tier's CTA sends the visitor to the enquiry form on the home page.
  // Index scrolls to the hash target once it has mounted.
  const handleContact = () => navigate("/#contact");

  return (
    <section className="py-24 min-h-screen bg-gradient-to-br from-australis-offWhite via-white to-australis-lightGray relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-australis-aqua/40 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-16 right-12 w-60 h-60 bg-gradient-to-xl from-white/20 to-australis-indigo/10 rounded-full blur-2xl"></div>
      <div className="container-custom relative z-10">
        <div className="flex items-center mb-6">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/60 backdrop-blur hover:bg-white/80 transition-colors shadow border border-white/30"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ArrowLeft size={20} className="text-australis-navy" />
            <span className="text-australis-navy font-medium text-base">Back</span>
          </button>
        </div>
        <div className="text-center mb-12">
          <div className="inline-block px-7 py-4 bg-white/50 border border-white/20 rounded-3xl shadow-xl backdrop-blur-2xl">
            <h1 className="text-3xl md:text-5xl font-extrabold text-australis-navy mb-2">
              Find the Plan That's Right for You
            </h1>
            <p className="text-lg max-w-2xl mx-auto text-australis-navy/70">
              Predictable, powerful plans that scale with your project pipeline.
            </p>
          </div>
        </div>
        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-8">
          {tiers.map((tier) => (
            <PricingCard
              key={tier.name}
              name={tier.name}
              description={tier.description}
              features={tier.features}
              detailedFeatures={tier.detailedFeatures}
              accent={tier.accent}
              recommended={tier.recommended}
              ctaText={tier.ctaText}
              buttonClass={tier.buttonClass || ""}
              onContact={handleContact}
            />
          ))}
        </div>
        {/* UK-wide and Country Pack info (moved to bottom) */}
        <div className="mt-14 flex justify-center">
          <div className="bg-white/50 border border-white/20 rounded-3xl shadow-md backdrop-blur-2xl px-8 py-6 max-w-2xl w-full text-center">
            <p className="text-lg text-australis-navy/80">
              All plans are for UK-wide analysis. Future country-specific access will be available via <span className="font-semibold">&quot;Country Packs&quot;</span>.
            </p>
          </div>
        </div>
        {/* Usage info and contact */}
        <div className="text-center mt-10 text-australis-navy/60 max-w-xl mx-auto">
          For detailed usage info, integrations, or to discuss custom enterprise solutions,{" "}
          <a
            className="inline underline text-australis-indigo hover:text-australis-aqua font-medium transition-colors"
            href="mailto:hello@australis.energy?subject=Enquiry%20from%20website"
            target="_blank"
            rel="noopener noreferrer"
          >
            contact our team
          </a>
          .
        </div>
      </div>
    </section>
  );
};

export default Pricing;
