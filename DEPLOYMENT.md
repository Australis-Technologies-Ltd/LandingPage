# Australis Energy Landing Site - Production Deployment Guide

## GitHub Repository Secrets Configuration

### Required Environment Variables

Set these as **repository secrets** in GitHub (Settings > Secrets and variables > Actions):

```bash
# Core Application
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Azure Services
VITE_AZURE_MAPS_KEY=your_azure_maps_key
VITE_AZURE_STORAGE_ACCOUNT=your_storage_account_name
VITE_AZURE_STORAGE_KEY=your_storage_account_key

# Australis API
VITE_API_KEY=your_production_api_key

# Azure Functions
VITE_GEOSERVICES_FUNCTION_URL=https://your-geoservices-function.azurewebsites.net
VITE_GEOSERVICES_FUNCTION_KEY=your_geoservices_function_key

# Optional Services
VITE_SERVICE_BUS_CONNECTION_STRING=your_service_bus_connection_string
VITE_APPINSIGHTS_INSTRUMENTATION_KEY=your_appinsights_key
```

## Deployment Options

### Option 1: GitHub Pages (Recommended)
- **URL**: `https://username.github.io/repository-name`
- **Setup**: Enable GitHub Pages in repository settings
- **Action**: Uses `.github/workflows/deploy.yml` (already created)
- **Cost**: Free
- **Custom Domain**: Supported

### Option 2: Vercel
- **URL**: `https://project-name.vercel.app`
- **Setup**: Connect GitHub repo to Vercel
- **Config**: Uses `vercel.json` (already created)
- **Environment Variables**: Set in Vercel dashboard
- **Cost**: Free tier available

### Option 3: Netlify
- **URL**: `https://project-name.netlify.app`
- **Setup**: Connect GitHub repo to Netlify
- **Config**: Uses `netlify.toml` (already created)
- **Environment Variables**: Set in Netlify dashboard
- **Cost**: Free tier available

## Security Considerations

### Environment Variables
- ✅ **All secrets are stored in GitHub repository secrets**
- ✅ **No sensitive data in source code**
- ✅ **Environment-specific configuration**
- ✅ **HTTPS-only URLs in production**

### API Keys
- Use **production-specific keys** (not development/staging)
- Ensure **minimal required permissions** for each service
- **Rotate keys regularly** (quarterly recommended)
- Use **separate Azure subscriptions** for production

### Function Keys
- Use **function-level authentication** (not host-level)
- **Enable CORS** properly for your domain
- Consider **IP restrictions** if applicable
- Monitor **usage and quotas**

## Pre-Deployment Checklist

### 1. Environment Variables
- [ ] All secrets added to GitHub repository secrets
- [ ] Production URLs configured (not development)
- [ ] API keys are production-specific
- [ ] Function keys are function-level (not master)

### 2. Configuration
- [ ] `VITE_APP_ENV=production` set in deployment
- [ ] CORS configured for production domain
- [ ] Azure Functions scaled appropriately
- [ ] Database connections use production instances

### 3. Testing
- [ ] Build completes without errors (`npm run build`)
- [ ] All features work in production environment
- [ ] Expert Panel form sends emails successfully
- [ ] No console errors in browser

### 4. Monitoring
- [ ] Application Insights configured
- [ ] Error tracking enabled
- [ ] Performance monitoring active
- [ ] Cost alerts configured

## Post-Deployment

### 1. Verify Functionality
1. Navigate to deployed site
2. Test Expert Panel form submission
3. Verify emails are received
4. Check Application Insights for telemetry

### 2. Set Up Monitoring
1. Configure Azure Monitor alerts
2. Set up cost management alerts
3. Enable security monitoring
4. Create uptime checks

### 3. Domain Configuration (Optional)
1. Purchase custom domain
2. Configure DNS records
3. Enable HTTPS/SSL certificates
4. Update CORS configurations

## Troubleshooting

### Common Issues

#### Build Fails
- Check all required environment variables are set
- Verify no TypeScript errors locally
- Check Node.js version compatibility

#### Lead Forms Not Working
- The forms post to Portal.API `POST /access-request` at `VITE_PORTAL_API_BASE_URL` (a repo variable, default `https://api-dev.australis.energy`)
- Ensure Portal.API's marketing CORS policy allows your origin
- Check Portal.API's logs for `AccessRequest` lines

#### Missing Environment Variables
- Environment variables must be prefixed with `VITE_`
- Variables are injected at build time (not runtime)
- Check case sensitivity of variable names

## Support

For deployment issues:
1. Check GitHub Actions logs
2. Review Azure Function logs
3. Verify Application Insights telemetry
4. Contact platform support (GitHub/Vercel/Netlify)
