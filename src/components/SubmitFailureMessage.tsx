import type { SubmitLeadFailureReason } from '@/services/accessRequestService';

const CONTACT_EMAIL = 'hello@australis.energy';

/**
 * Shown when a lead form's submission genuinely fails. Lead forms await the real
 * result, so a visitor who sees this has not reached us — always give them a route
 * that does not depend on the form working.
 *
 * Rate-limiting is called out separately because it is transient and self-resolving:
 * telling someone to email us instead would be wrong advice when waiting a moment
 * fixes it.
 */
const SubmitFailureMessage = ({ reason }: { reason?: SubmitLeadFailureReason }) => {
  if (reason === 'rate-limited') {
    return <span>Too many attempts just now. Please wait a moment and try again.</span>;
  }

  return (
    <span>
      Your details didn&apos;t reach us. Please try again, or email us directly at{' '}
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="underline font-medium underline-offset-2"
      >
        {CONTACT_EMAIL}
      </a>
      .
    </span>
  );
};

export default SubmitFailureMessage;
