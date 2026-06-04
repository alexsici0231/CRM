import type { IntegrationHealth, IntegrationProvider } from '@/types/integrations';

const envMap: Record<IntegrationProvider, { label: string; keys: string[] }> = {
  meta_ads: { label: 'Meta Ads', keys: ['META_ACCESS_TOKEN', 'META_AD_ACCOUNT_ID'] },
  google_ads: {
    label: 'Google Ads',
    keys: ['GOOGLE_ADS_CUSTOMER_ID', 'GOOGLE_ADS_DEVELOPER_TOKEN', 'GOOGLE_ADS_CLIENT_ID', 'GOOGLE_ADS_CLIENT_SECRET', 'GOOGLE_ADS_REFRESH_TOKEN'],
  },
  callrail: { label: 'CallRail', keys: ['CALLRAIL_API_KEY', 'CALLRAIL_ACCOUNT_ID', 'CALLRAIL_COMPANY_ID'] },
  twilio: { label: 'Twilio', keys: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER'] },
  google_business: { label: 'Google Business Profile', keys: ['GOOGLE_BUSINESS_ACCOUNT_ID', 'GOOGLE_BUSINESS_LOCATION_IDS', 'GOOGLE_BUSINESS_REFRESH_TOKEN'] },
};

export function getMissingEnv(provider: IntegrationProvider) {
  return envMap[provider].keys.filter((key) => !process.env[key]);
}

export function getIntegrationHealth(): IntegrationHealth[] {
  return (Object.keys(envMap) as IntegrationProvider[]).map((provider) => {
    const missingEnv = getMissingEnv(provider);
    return {
      provider,
      label: envMap[provider].label,
      status: missingEnv.length ? 'mock' : 'connected',
      missingEnv,
      lastSyncAt: null,
      message: missingEnv.length ? 'Работает в demo/mock режиме до добавления env-переменных.' : 'Готово к live sync.',
    };
  });
}

export function isLive(provider: IntegrationProvider) {
  return getMissingEnv(provider).length === 0;
}
