import { useInView } from 'react-intersection-observer';
import Marquee from 'react-fast-marquee';

const SocialProofSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  interface Partner {
    name: string;
    logo: string;
    heightClass?: string;
  }

  const partners: Partner[] = [
    { name: "Geovation", logo: "/uploads/geovation-clean.png" },
    { name: "Ordnance Survey", logo: "/uploads/8624a46a-939e-4720-bb86-9838bd50d189.png" },
    { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
    { name: "NVIDIA", logo: "/assets/brand/nvidia-logo.svg", heightClass: "h-8" },
  ];

  return (
    <section className="py-16 bg-white" ref={ref}>
      <div className={`container-custom max-w-4xl ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-australis-navy/40 mb-10">
          Built with the backing of
        </p>

        <div className="relative overflow-hidden">
          {/* Edge fades so logos dissolve in and out */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
          <Marquee gradient={false} speed={45} pauseOnHover={true} autoFill={true} className="w-full">
            {partners.map((partner, index) => (
              <div key={index} className="flex items-center justify-center p-4 h-20 min-w-[180px] mx-8">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className={`${partner.heightClass ?? 'h-11'} w-auto object-contain mix-blend-multiply grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500`}
                />
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
