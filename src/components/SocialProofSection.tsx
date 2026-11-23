import { useInView } from 'react-intersection-observer';

interface Partner {
  name: string;
  logo: string;
  heightClass?: string;
}

const partners: Partner[] = [
  { name: "NVIDIA", logo: "/assets/brand/nvidia-logo.svg", heightClass: "h-8" },
  { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
  { name: "Ordnance Survey", logo: "/uploads/8624a46a-939e-4720-bb86-9838bd50d189.png" },
  { name: "Geovation", logo: "/uploads/geovation-clean.png" },
];

const SocialProofSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section className="py-16 bg-white" ref={ref}>
      <div className={`container-custom max-w-4xl ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-australis-navy/40 mb-10">
          Built with the backing of
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 items-center justify-items-center">
          {partners.map((partner) => (
            <div key={partner.name} className="flex items-center justify-center p-4 h-20 w-full">
              <img
                src={partner.logo}
                alt={partner.name}
                className={`${partner.heightClass ?? 'h-11'} w-auto object-contain mix-blend-multiply grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
