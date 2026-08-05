const CONTACT_EMAIL = 'hello@australis.energy';

/**
 * Shown when a lead form's send genuinely fails. Lead forms await the real
 * result (see `useEmailSending`), so a visitor who sees this has not reached us —
 * always give them a route that does not depend on the form working.
 */
const SubmitFailureMessage = () => (
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

export default SubmitFailureMessage;
