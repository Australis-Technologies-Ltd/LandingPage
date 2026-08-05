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
  
  // Azure Functions
  functions: {
    communications: {
      url: string;
      key: string;
    };
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
  // Only validate truly required variables for the landing page
  const required = [
    'VITE_COMMUNICATIONS_FUNCTION_URL',
    'VITE_COMMUNICATIONS_FUNCTION_KEY',
  ];
  
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.warn(
      `Missing required environment variables for Expert Panel: ${missing.join(', ')}\n` +
      'The Expert Panel form will not work until these are configured.'
    );
    
    // Don't throw errors during build - just warn
    // The communications service will handle the missing config gracefully
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
  
  functions: {
    communications: {
      url: getEnvVar('VITE_COMMUNICATIONS_FUNCTION_URL', 'http://localhost:7027/api/send-email'),
      key: getEnvVar('VITE_COMMUNICATIONS_FUNCTION_KEY', ''),
    },
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
