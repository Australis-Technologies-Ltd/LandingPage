/**
 * Communications Service for Australis Energy Platform
 * Handles email sending via Azure Communications Function
 */

import { config } from '@/lib/config';

export interface SendEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  type?: 'contact' | 'support' | 'newsletter' | 'expert-panel' | 'waiting-list' | 'demo-request';
  to?: string;
  recaptchaToken?: string;
}

export interface SendEmailResponse {
  success: boolean;
  message?: string;
  error?: string;
}

class CommunicationsService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = config.functions.communications.url;
    
    // Log configuration status for debugging
    if (!this.baseUrl) {
      console.error('❌ Communications Function URL is not configured');
      console.log('💡 Make sure VITE_COMMUNICATIONS_FUNCTION_URL is set in your environment');
    } else {
      console.log('✅ Communications service initialized:', this.baseUrl);
    }
  }

  /**
   * Makes an authenticated request to the Communications Azure Function
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.baseUrl) {
      throw new Error('Communications function URL is not configured');
    }

    // Construct the full URL - baseUrl should already include the endpoint
    let url = this.baseUrl;
    
    // For Azure Functions with function-level authorization, add the code as a query parameter
    const functionKey = config.functions.communications.key;
    if (functionKey) {
      const separator = url.includes('?') ? '&' : '?';
      url = `${url}${separator}code=${functionKey}`;
    }
    
    // Only log in development
    if (config.env === 'development') {
      console.log('Making request to:', url.replace(functionKey || '', '***')); // Log URL but hide key
    }
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (config.env === 'development') {
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      }

      if (!response.ok) {
        const errorText = await response.text();
        if (config.env === 'development') {
          console.error('Response error text:', errorText);
        }
        throw new Error(`Communications function request failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      if (config.env === 'development') {
        console.log('Response data:', result);
      }
      return result;
    } catch (error) {
      console.error(`Communications request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Send an email using the Azure Communications Service
   */
  async sendEmail(emailRequest: SendEmailRequest): Promise<SendEmailResponse> {
    try {
      // Validate required fields
      if (!emailRequest.name || !emailRequest.email || !emailRequest.subject || !emailRequest.message) {
        return {
          success: false,
          error: 'Missing required fields: name, email, subject, and message are required'
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailRequest.email)) {
        return {
          success: false,
          error: 'Invalid email format'
        };
      }

      // Make request to Azure Function
      const azureResponse = await this.request<{ ok: boolean; operationId?: string; status?: string; error?: string }>('', {
        method: 'POST',
        body: JSON.stringify(emailRequest),
      });

      console.log('Azure Function response:', azureResponse);

      // Convert Azure Function response format to our expected format
      if (azureResponse && azureResponse.ok === true) {
        console.log('Email sent successfully, returning success response');
        return {
          success: true,
          message: `Email sent successfully. Status: ${azureResponse.status || 'Queued'}`
        };
      } else {
        console.log('Email sending failed, Azure Function returned ok: false or undefined');
        return {
          success: false,
          error: azureResponse?.error || 'Email sending failed - Azure Function returned ok: false'
        };
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Send an email using the Azure Communications Service with optimistic UI
   */
  async sendEmailOptimistic(emailRequest: SendEmailRequest): Promise<SendEmailResponse> {
    try {
      // Validate required fields
      if (!emailRequest.name || !emailRequest.email || !emailRequest.subject || !emailRequest.message) {
        return {
          success: false,
          error: 'Missing required fields: name, email, subject, and message are required'
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRequest.email.match(emailRegex)) {
        return {
          success: false,
          error: 'Invalid email format'
        };
      }

      // Return immediate success response
      const optimisticResponse = {
        success: true,
        message: 'Email sent successfully'
      };

      // Process actual request in background
      this.processEmailInBackground(emailRequest);

      return optimisticResponse;
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Process email request in background with error handling
   */
  private async processEmailInBackground(emailRequest: SendEmailRequest): Promise<void> {
    try {
      const azureResponse = await this.request<{ ok: boolean; operationId?: string; status?: string; error?: string }>('', {
        method: 'POST',
        body: JSON.stringify(emailRequest),
      });

      if (azureResponse?.ok) {
        console.log('✅ Background email processing successful:', azureResponse.operationId);
        
        // Optional: Store success in local storage for analytics
        if (typeof window !== 'undefined') {
          const successCount = parseInt(localStorage.getItem('email_success_count') || '0') + 1;
          localStorage.setItem('email_success_count', successCount.toString());
        }
      } else {
        console.warn('⚠️ Background email processing failed:', azureResponse?.error);
        
        // Optional: Implement retry logic
        this.scheduleEmailRetry(emailRequest);
      }
    } catch (error) {
      console.error('❌ Background email processing error:', error);
      
      // Optional: Implement retry logic
      this.scheduleEmailRetry(emailRequest);
    }
  }

  /**
   * Schedule email retry with exponential backoff
   */
  private scheduleEmailRetry(emailRequest: SendEmailRequest, attempt: number = 1): void {
    const maxRetries = 3;
    const baseDelay = 2000; // 2 seconds
    
    if (attempt > maxRetries) {
      console.error('❌ Max email retries exceeded, giving up');
      return;
    }

    const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
    
    setTimeout(async () => {
      console.log(`🔄 Retrying email send (attempt ${attempt}/${maxRetries})`);
      
      try {
        const azureResponse = await this.request<{ ok: boolean; operationId?: string; status?: string; error?: string }>('', {
          method: 'POST',
          body: JSON.stringify(emailRequest),
        });

        if (azureResponse?.ok) {
          console.log('✅ Email retry successful:', azureResponse.operationId);
        } else {
          console.warn(`⚠️ Email retry ${attempt} failed:`, azureResponse?.error);
          this.scheduleEmailRetry(emailRequest, attempt + 1);
        }
      } catch (error) {
        console.error(`❌ Email retry ${attempt} error:`, error);
        this.scheduleEmailRetry(emailRequest, attempt + 1);
      }
    }, delay);
  }

  /**
   * Send a contact form email (convenience method)
   */
  async sendContactForm(
    name: string,
    email: string,
    message: string,
    recaptchaToken?: string
  ): Promise<SendEmailResponse> {
    return this.sendEmail({
      name,
      email,
      subject: `Contact Form Submission from ${name}`,
      message: `
Name: ${name}
Email: ${email}

Message:
${message}
      `.trim(),
      type: 'contact',
      recaptchaToken,
    });
  }

  /**
   * Send a contact form email with optimistic response (convenience method)
   */
  async sendContactFormOptimistic(
    name: string,
    email: string,
    message: string,
    recaptchaToken?: string
  ): Promise<SendEmailResponse> {
    return this.sendEmailOptimistic({
      name,
      email,
      subject: `Contact Form Submission from ${name}`,
      message: `
Name: ${name}
Email: ${email}

Message:
${message}
      `.trim(),
      type: 'contact',
      recaptchaToken,
    });
  }

  /**
   * Send a support request email
   */
  async sendSupportRequest(
    name: string,
    email: string,
    subject: string,
    description: string,
    priority: 'low' | 'medium' | 'high' = 'medium',
    recaptchaToken?: string
  ): Promise<SendEmailResponse> {
    return this.sendEmail({
      name,
      email,
      subject: `[${priority.toUpperCase()}] Support Request: ${subject}`,
      message: `
Support Request Details:

Name: ${name}
Email: ${email}
Priority: ${priority}
Subject: ${subject}

Description:
${description}
      `.trim(),
      type: 'support',
      recaptchaToken,
    });
  }

  /**
   * Send a newsletter signup confirmation
   */
  async sendNewsletterSignup(
    name: string,
    email: string,
    recaptchaToken?: string
  ): Promise<SendEmailResponse> {
    return this.sendEmail({
      name,
      email,
      subject: 'Newsletter Subscription - Australis Energy',
      message: `
Hello ${name},

Thank you for subscribing to the Australis Energy newsletter!

You'll receive updates about:
- New features and product updates
- Industry insights and renewable energy news
- Beta access opportunities
- Company announcements

Best regards,
The Australis Energy Team
      `.trim(),
      type: 'newsletter',
      recaptchaToken,
    });
  }

  /**
   * Send expert panel application (full version)
   */
  async sendExpertPanelApplication(
    name: string,
    email: string,
    expertise: string,
    experience: string,
    recaptchaToken?: string
  ): Promise<SendEmailResponse> {
    return this.sendEmail({
      name,
      email,
      subject: `Expert Panel Application from ${name}`,
      message: `
Expert Panel Application:

Name: ${name}
Email: ${email}

Area of Expertise:
${expertise}

Relevant Experience:
${experience}
      `.trim(),
      recaptchaToken,
    });
  }

  /**
   * Send expert panel interest (simplified version with just email)
   */
  async sendExpertPanelInterest(
    email: string,
    recaptchaToken?: string
  ): Promise<SendEmailResponse> {
    return this.sendEmail({
      name: 'Expert Panel Interested User',
      email,
      subject: 'Expert Panel Interest Expression',
      message: `
Expert Panel Interest:

Email: ${email}

A user has expressed interest in joining the expert panel. 
Please follow up to collect additional details about their expertise and experience.
      `.trim(),
      type: 'expert-panel',
      recaptchaToken,
    });
  }

  /**
   * Send expert panel interest with optimistic response
   */
  async sendExpertPanelInterestOptimistic(
    email: string,
    recaptchaToken?: string
  ): Promise<SendEmailResponse> {
    return this.sendEmailOptimistic({
      name: 'Expert Panel Interested User',
      email,
      subject: 'Expert Panel Interest Expression',
      message: `
Expert Panel Interest:

Email: ${email}

A user has expressed interest in joining the expert panel. 
Please follow up to collect additional details about their expertise and experience.
      `.trim(),
      type: 'expert-panel',
      recaptchaToken,
    });
  }

  /**
   * Send waiting list interest
   */
  async sendWaitingListInterest(
    email: string,
    recaptchaToken?: string
  ): Promise<SendEmailResponse> {
    return this.sendEmail({
      name: 'Waiting List User',
      email,
      subject: 'Waiting List Registration',
      message: `
Waiting List Registration:

Email: ${email}

A user has joined the waiting list for early access to Australis Energy Platform.
Please add them to the waiting list and keep them informed of platform updates.
      `.trim(),
      type: 'waiting-list',
      recaptchaToken,
    });
  }

  /**
   * Send waiting list interest with optimistic response
   */
  async sendWaitingListInterestOptimistic(
    email: string,
    recaptchaToken?: string
  ): Promise<SendEmailResponse> {
    return this.sendEmailOptimistic({
      name: 'Waiting List User',
      email,
      subject: 'Waiting List Registration',
      message: `
Waiting List Registration:

Email: ${email}

A user has joined the waiting list for early access to Australis Energy Platform.
Please add them to the waiting list and keep them informed of platform updates.
      `.trim(),
      type: 'waiting-list',
      recaptchaToken,
    });
  }

  /**
   * Send demo request
   */
  async sendDemoRequest(
    email: string,
    recaptchaToken?: string
  ): Promise<SendEmailResponse> {
    return this.sendEmail({
      name: 'Demo Interested User',
      email,
      subject: 'Demo Request',
      message: `
Demo Request:

Email: ${email}

A user has requested a demo of the Australis Energy Platform.
Please follow up to schedule a demonstration.
      `.trim(),
      type: 'demo-request',
      recaptchaToken,
    });
  }

  /**
   * Send demo request with optimistic response
   */
  async sendDemoRequestOptimistic(
    email: string,
    recaptchaToken?: string
  ): Promise<SendEmailResponse> {
    return this.sendEmailOptimistic({
      name: 'Demo Interested User',
      email,
      subject: 'Demo Request',
      message: `
Demo Request:

Email: ${email}

A user has requested a demo of the Australis Energy Platform.
Please follow up to schedule a demonstration.
      `.trim(),
      type: 'demo-request',
      recaptchaToken,
    });
  }

  /**
   * Send CTA form submission with detailed user information
   */
  async sendCtaFormSubmission(
    name: string,
    workEmail: string,
    companyRole: string,
    challenge: string,
    recaptchaToken?: string
  ): Promise<SendEmailResponse> {
    return this.sendEmail({
      name,
      email: workEmail,
      subject: `CTA Form Submission from ${name}`,
      message: `
CTA Form Submission:

Name: ${name}
Work Email: ${workEmail}
Company and Role: ${companyRole}
Primary Challenge: ${challenge}

Please follow up with this prospect who has expressed interest in accelerating their renewable energy pipeline.
      `.trim(),
      type: 'contact',
      recaptchaToken,
    });
  }

  /**
   * Send CTA form submission with optimistic response
   */
  async sendCtaFormSubmissionOptimistic(
    name: string,
    workEmail: string,
    companyRole: string,
    challenge: string,
    recaptchaToken?: string
  ): Promise<SendEmailResponse> {
    return this.sendEmailOptimistic({
      name,
      email: workEmail,
      subject: `CTA Form Submission from ${name}`,
      message: `
CTA Form Submission:

Name: ${name}
Work Email: ${workEmail}
Company and Role: ${companyRole}
Primary Challenge: ${challenge}

Please follow up with this prospect who has expressed interest in accelerating their renewable energy pipeline.
      `.trim(),
      type: 'contact',
      recaptchaToken,
    });
  }

  /**
   * Health check for Communications service
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      // Since your function doesn't have a health endpoint, we'll just test connectivity
      const response = await fetch(this.baseUrl, { method: 'GET' });
      return {
        status: response.ok ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// Export singleton instance
export const communicationsService = new CommunicationsService();

// Export convenience functions for direct use
export const sendEmail = (emailRequest: SendEmailRequest) => communicationsService.sendEmail(emailRequest);
export const sendContactForm = (name: string, email: string, message: string, recaptchaToken?: string) => 
  communicationsService.sendContactForm(name, email, message, recaptchaToken);
export const sendSupportRequest = (name: string, email: string, subject: string, description: string, priority?: 'low' | 'medium' | 'high', recaptchaToken?: string) => 
  communicationsService.sendSupportRequest(name, email, subject, description, priority, recaptchaToken);
export const sendNewsletterSignup = (name: string, email: string, recaptchaToken?: string) => 
  communicationsService.sendNewsletterSignup(name, email, recaptchaToken);
export const sendExpertPanelApplication = (name: string, email: string, expertise: string, experience: string, recaptchaToken?: string) => 
  communicationsService.sendExpertPanelApplication(name, email, expertise, experience, recaptchaToken);
export const sendExpertPanelInterest = (email: string, recaptchaToken?: string) => 
  communicationsService.sendExpertPanelInterest(email, recaptchaToken);
export const sendWaitingListInterest = (email: string, recaptchaToken?: string) => 
  communicationsService.sendWaitingListInterest(email, recaptchaToken);
export const sendDemoRequest = (email: string, recaptchaToken?: string) => 
  communicationsService.sendDemoRequest(email, recaptchaToken);
export const sendCtaFormSubmission = (name: string, workEmail: string, companyRole: string, challenge: string, recaptchaToken?: string) => 
  communicationsService.sendCtaFormSubmission(name, workEmail, companyRole, challenge, recaptchaToken);

// Export optimistic convenience functions
export const sendEmailOptimistic = (emailRequest: SendEmailRequest) => communicationsService.sendEmailOptimistic(emailRequest);
export const sendContactFormOptimistic = (name: string, email: string, message: string, recaptchaToken?: string) => 
  communicationsService.sendContactFormOptimistic(name, email, message, recaptchaToken);
export const sendExpertPanelInterestOptimistic = (email: string, recaptchaToken?: string) => 
  communicationsService.sendExpertPanelInterestOptimistic(email, recaptchaToken);
export const sendWaitingListInterestOptimistic = (email: string, recaptchaToken?: string) => 
  communicationsService.sendWaitingListInterestOptimistic(email, recaptchaToken);
export const sendDemoRequestOptimistic = (email: string, recaptchaToken?: string) => 
  communicationsService.sendDemoRequestOptimistic(email, recaptchaToken);
export const sendCtaFormSubmissionOptimistic = (name: string, workEmail: string, companyRole: string, challenge: string, recaptchaToken?: string) => 
  communicationsService.sendCtaFormSubmissionOptimistic(name, workEmail, companyRole, challenge, recaptchaToken);
