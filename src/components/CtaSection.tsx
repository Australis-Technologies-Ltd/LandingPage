import { Button } from '@/components/ui/button';
import NewsletterForm from './NewsletterForm';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { sendCtaFormSubmission } from '@/services/communicationsService';
import { useRecaptcha } from '@/hooks/useRecaptcha';
import SubmitFailureMessage from '@/components/SubmitFailureMessage';

const CtaSection = () => {
  const { toast } = useToast();
  const { executeRecaptcha } = useRecaptcha();
  const [formData, setFormData] = useState({
    name: '',
    workEmail: '',
    companyRole: '',
    challenge: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const challenges = [
    'Accelerating site identification & screening',
    'De-risking our investment pipeline & portfolio',
    'Automating early-stage due diligence for our clients',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.workEmail || !formData.companyRole || !formData.challenge) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields.",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Execute reCAPTCHA
      const recaptchaToken = await executeRecaptcha('cta_form_submission');
      
      // Awaited, not optimistic — the visitor is only told this worked once it has.
      const result = await sendCtaFormSubmission(
        formData.name,
        formData.workEmail,
        formData.companyRole,
        formData.challenge,
        recaptchaToken || undefined
      );

      if (result.success) {
        toast({
          title: "Thank you!",
          description: "We've received your information and will be in touch soon.",
          duration: 5000,
        });

        setFormData({ name: '', workEmail: '', companyRole: '', challenge: '' });
      } else {
        console.error('CTA form submission failed:', result.error);
        toast({
          variant: "destructive",
          title: "We couldn't submit that",
          description: <SubmitFailureMessage />,
          duration: 10000,
        });
      }
    } catch (error) {
      console.error('CTA form submission failed:', error);
      toast({
        variant: "destructive",
        title: "We couldn't submit that",
        description: <SubmitFailureMessage />,
        duration: 10000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 scroll-mt-20 relative overflow-hidden">
      {/* Background with gradient and blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-australis-navy via-australis-navy/95 to-[#2d2f4a] z-0"></div>
      <div className="absolute inset-0 bg-grid-pattern-light z-0"></div>
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-australis-aqua/20 rounded-full blur-3xl animate-pulse-slow z-0"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-australis-indigo/25 rounded-full blur-3xl animate-pulse-slow z-0"></div>
      {/* Gradient hairline along the top edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-australis-aqua/60 to-transparent z-0"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="backdrop-blur-md bg-white/[0.04] p-8 rounded-2xl border border-white/10 shadow-2xl shadow-black/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to accelerate your{' '}
              <span className="bg-gradient-to-r from-australis-aqua to-[#7ef9d0] bg-clip-text text-transparent">renewable energy pipeline?</span>
            </h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 text-white">
              Join the developers using Australis to make smarter site decisions, faster.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-australis-aqua/50 focus:border-transparent backdrop-blur-sm"
                  placeholder="Name"
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  name="workEmail"
                  value={formData.workEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-australis-aqua/50 focus:border-transparent backdrop-blur-sm"
                  placeholder="Work Email"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  name="companyRole"
                  value={formData.companyRole}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-australis-aqua/50 focus:border-transparent backdrop-blur-sm"
                  placeholder="Company and Role"
                  required
                />
              </div>

              <div>
                <p className="text-white text-sm mb-3">What is the primary challenge you are looking to solve?</p>
                <div className="space-y-2">
                  {challenges.map((challenge) => (
                    <label key={challenge} className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="challenge"
                        value={challenge}
                        checked={formData.challenge === challenge}
                        onChange={handleInputChange}
                        className="mt-1 w-4 h-4 text-australis-aqua bg-white/10 border-white/30 focus:ring-australis-aqua/50 focus:ring-2"
                        required
                      />
                      <span className="text-white/90 text-sm group-hover:text-white transition-colors">
                        {challenge}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-australis-aqua to-[#2fd9a1] text-australis-navy font-semibold hover:shadow-xl hover:shadow-australis-aqua/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-white/70 text-sm">
                Join the top UK developers assessing 500+ sites for 2025 deployments.
              </p>
            </div>
          </div>
          
          <div className="backdrop-blur-md bg-white/[0.04] p-8 rounded-2xl border border-white/10 shadow-2xl shadow-black/20">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
