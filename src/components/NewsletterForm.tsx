import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LeadSource, submitLead } from '@/services/accessRequestService';
import SubmitFailureMessage from '@/components/SubmitFailureMessage';
const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your email address.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await submitLead({ email, source: LeadSource.Newsletter });

      if (result.success) {
        setIsSubscribed(true);
        setEmail('');
        toast({
          title: "🎯 You're on the list!",
          description: "We'll keep you updated with the latest news. Thanks for subscribing!",
          duration: 6000,
        });
      } else {
        // Previously this branch did nothing at all — a failed signup looked
        // identical to no interaction.
        console.error('Newsletter signup failed:', result.error);
        toast({
          variant: "destructive",
          title: result.reason === 'rate-limited' ? "One moment" : "We couldn't subscribe you",
          description: <SubmitFailureMessage reason={result.reason} />,
          duration: 10000,
        });
      }
    } catch (error) {
      console.error('Newsletter signup failed:', error);
      toast({
        variant: "destructive",
        title: "We couldn't subscribe you",
        description: <SubmitFailureMessage />,
        duration: 10000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8">
      <h3 className="text-xl font-semibold mb-4 text-slate-50">Stay updated</h3>
      <p className="text-white/80 mb-6">
        Subscribe for product updates and exclusive insights.
      </p>
      
      {isSubscribed ? <div className="flex items-center gap-3 text-white">
          <div className="bg-australis-teal rounded-full p-1">
            <Check className="h-4 w-4" />
          </div>
          <span>You're subscribed!</span>
        </div> : <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input type="email" placeholder="Your work email" value={email} onChange={e => setEmail(e.target.value)} required className="bg-white/20 border-white/30 text-white placeholder:text-white/60" />
          </div>
          <Button type="submit" className="w-full bg-white text-australis-blue hover:bg-white/90" disabled={isLoading}>
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>}
    </div>;
};
export default NewsletterForm;