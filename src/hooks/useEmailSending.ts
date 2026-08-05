/**
 * React Hook for Communications Service
 * Provides easy-to-use email sending functionality with loading states
 */

import { useState } from 'react';
import { 
  sendExpertPanelInterest as sendExpertPanelInterestService,
  sendWaitingListInterest as sendWaitingListInterestService,
  sendDemoRequest as sendDemoRequestService,
  sendExpertPanelInterestOptimistic as sendExpertPanelInterestOptimisticService,
  sendWaitingListInterestOptimistic as sendWaitingListInterestOptimisticService,
  sendDemoRequestOptimistic as sendDemoRequestOptimisticService,
  SendEmailResponse
} from '@/services/communicationsService';

/**
 * Lead-capture forms must await the real send. The optimistic variants report
 * success before the request is made and swallow a permanent failure into the
 * console, which loses the lead silently — so optimistic is opt-in, never the
 * default. No lead form currently opts in.
 */
export const useEmailSending = (useOptimistic: boolean = false) => {
  const [isLoading, setIsLoading] = useState(false);

  const sendExpertPanelInterest = async (email: string, recaptchaToken?: string): Promise<SendEmailResponse> => {
    setIsLoading(true);
    try {
      const service = useOptimistic ? sendExpertPanelInterestOptimisticService : sendExpertPanelInterestService;
      const result = await service(email, recaptchaToken);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const sendWaitingListInterest = async (email: string, recaptchaToken?: string): Promise<SendEmailResponse> => {
    setIsLoading(true);
    try {
      const service = useOptimistic ? sendWaitingListInterestOptimisticService : sendWaitingListInterestService;
      const result = await service(email, recaptchaToken);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const sendDemoRequest = async (email: string, recaptchaToken?: string): Promise<SendEmailResponse> => {
    setIsLoading(true);
    try {
      const service = useOptimistic ? sendDemoRequestOptimisticService : sendDemoRequestService;
      const result = await service(email, recaptchaToken);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendExpertPanelInterest,
    sendWaitingListInterest,
    sendDemoRequest,
    isLoading
  };
};
