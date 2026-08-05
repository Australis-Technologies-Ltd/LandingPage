/**
 * Application Configuration
 * Centralizes all environment variables and configuration management
 */

// Import debug utilities
import { debugConfig } from './debug-config';

// Run debug in development
if (import.meta.env.DEV) {
  debugConfig();
}

interface AppConfig {
  // Environment
  env: 'development' | 'staging' | 'production';
  
  // Supabase
  supabase: {
    url: string;
    anonKey: string;
  };
  
  // Azure Services
  azure: {
    maps: {
      key: string;
    };
    storage: {
      account: string;
      key: string;
    };
    appInsights: {
      instrumentationKey: string;
    };
  };
  
  // Portal.API — lead capture (POST /access-request)
  portalApi: {
    baseUrl: string;
  };

  // Azure Service Bus
  serviceBus: {
    connectionString: string;
  };
  
  // reCAPTCHA
  recaptcha: {
    siteKey: string;
  };
}

/**
 * Validates that required environment variables are present
 */
const validateConfig = (): void => {
  // Only validate truly required variables for the landing page.
  const required = ['VITE_PORTAL_API_BASE_URL'];

  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    console.warn(
      `Missing environment variables: ${missing.join(', ')}\n` +
      'Lead forms will fall back to the dev Portal.API host baked into config.ts.'
    );

    // Don't throw during build — there is a working default, and a missing
    // variable should not break the marketing site.
  }
};

/**
 * Gets environment variable with optional default value
 */
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key];
  if (!value && defaultValue === undefined) {
    console.warn(`Environment variable ${key} is not set`);
    return '';
  }
  return value || defaultValue || '';
};

/**
 * Application configuration object
 */
export const config: AppConfig = {
  env: (import.meta.env.VITE_APP_ENV as AppConfig['env']) || 'development',
  
  supabase: {
    url: getEnvVar('VITE_SUPABASE_URL'),
    anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
  },
  
  azure: {
    maps: {
      key: getEnvVar('VITE_AZURE_MAPS_KEY'),
    },
    storage: {
      account: getEnvVar('VITE_AZURE_STORAGE_ACCOUNT'),
      key: getEnvVar('VITE_AZURE_STORAGE_KEY'),
    },
    appInsights: {
      instrumentationKey: getEnvVar('VITE_APPINSIGHTS_INSTRUMENTATION_KEY'),
    },
  },
  
  portalApi: {
    // Dev is the only Portal.API environment serving traffic; production is parked.
    baseUrl: getEnvVar('VITE_PORTAL_API_BASE_URL', 'https://api-dev.australis.energy'),
  },

  serviceBus: {
    connectionString: getEnvVar('VITE_SERVICE_BUS_CONNECTION_STRING'),
  },
  
  recaptcha: {
    siteKey: getEnvVar('VITE_RECAPTCHA_SITE_KEY', '6LdGy3wqAAAAAK-lI-udrJl57MD9ijxtC8ocDPdp'),
  },
};

/**
 * Initialize configuration validation
 */
export const initializeConfig = (): void => {
  try {
    validateConfig();
    console.log(`🔧 Configuration loaded for ${config.env} environment`);
  } catch (error) {
    console.error('❌ Configuration validation failed:', error);
    if (config.env === 'production') {
      throw error; // Fail fast in production
    }
  }
};

/**
 * Helper function to check if we're in development mode
 */
export const isDevelopment = (): boolean => config.env === 'development';

/**
 * Helper function to check if we're in production mode
 */
export const isProduction = (): boolean => config.env === 'production';

// Initialize configuration on module load
initializeConfig();
