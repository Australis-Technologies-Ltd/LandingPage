/**
 * Debug configuration for production deployment
 * This will help identify which environment variables are missing
 */

export const debugConfig = () => {
  console.group('🔧 Australis Config Debug');
  
  const envVars = {
    'VITE_PORTAL_API_BASE_URL': import.meta.env.VITE_PORTAL_API_BASE_URL,
    'VITE_APP_ENV': import.meta.env.VITE_APP_ENV,
    'NODE_ENV': import.meta.env.NODE_ENV,
    'PROD': import.meta.env.PROD,
  };
  
  console.table(envVars);
  
  const missing = Object.entries(envVars)
    .filter(([key, value]) => !value || value === '[MISSING]')
    .map(([key]) => key);
    
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing);
    console.log('💡 Add these to your hosting platform\'s environment variables');
  } else {
    console.log('✅ All required environment variables are configured');
  }
  
  console.groupEnd();
};

// Auto-run in development
if (import.meta.env.DEV) {
  debugConfig();
}
