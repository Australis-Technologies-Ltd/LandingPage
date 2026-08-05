/**
 * Lead capture — Portal.API `POST /access-request`.
 *
 * This replaced the Azure Communications Function, which emailed a lead and
 * persisted nothing. Portal.API stores a row, emails the requester and the team,
 * and keeps the row even if those sends fail.
 *
 * The endpoint is anonymous and CORS-allowed for the marketing origins under a
 * deliberately **non-credentialed** policy, so requests must NOT send cookies —
 * do not add `credentials: 'include'` here.
 *
 * Contract notes that matter:
 *  - `name` and `companyName` are optional *only* because we send a `source`.
 *    A request without a source is treated as a portal caller and requires both.
 *  - `source` values must match Portal.API's `AccessRequestSources` constants.
 *  - The endpoint is throttled per client IP and answers 429 when exceeded.
 */

import { config } from '@/lib/config';

/** Mirrors Portal.API `AccessRequestSources`. Keep the strings in step. */
export const LeadSource = {
  CtaForm: 'landing-cta-form',
  ExpertPanel: 'landing-expert-panel',
  WaitingList: 'landing-waiting-list',
  Newsletter: 'landing-newsletter',
} as const;

export type LeadSource = (typeof LeadSource)[keyof typeof LeadSource];

export interface SubmitLeadRequest {
  email: string;
  source: LeadSource;
  /** Only the main enquiry form collects a name. */
  name?: string;
}

export type SubmitLeadFailureReason = 'validation' | 'rate-limited' | 'transport';

export interface SubmitLeadResult {
  success: boolean;
  /** Present only on failure. Drives which message the visitor is shown. */
  reason?: SubmitLeadFailureReason;
  /** Technical detail for the console — never render this to a visitor. */
  error?: string;
}

const endpoint = () => `${config.portalApi.baseUrl.replace(/\/$/, '')}/access-request`;

export const submitLead = async (request: SubmitLeadRequest): Promise<SubmitLeadResult> => {
  const body: Record<string, string> = {
    email: request.email.trim(),
    source: request.source,
  };

  // Omit rather than send an empty string: Portal.API stores null for "never
  // collected", which is distinct from "asked and left blank".
  const name = request.name?.trim();
  if (name) {
    body.name = name;
  }

  let response: Response;
  try {
    response = await fetch(endpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (error) {
    // Network failure, DNS, CORS rejection — the request never completed.
    return {
      success: false,
      reason: 'transport',
      error: error instanceof Error ? error.message : 'Network request failed',
    };
  }

  if (response.ok) {
    return { success: true };
  }

  if (response.status === 429) {
    return { success: false, reason: 'rate-limited', error: 'Rate limit exceeded (429)' };
  }

  const detail = await response.text().catch(() => '');
  return {
    success: false,
    reason: response.status === 400 ? 'validation' : 'transport',
    error: `${response.status} ${response.statusText}${detail ? ` — ${detail}` : ''}`,
  };
};
