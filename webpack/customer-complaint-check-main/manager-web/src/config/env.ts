type EnvType = 'test' | 'online';

interface EnvConfig {
  baseURL: string;
}

const envConfigs: Record<EnvType, EnvConfig> = {
  test: {
    baseURL: '/api',
  },
  online: {
    baseURL: 'http://10.4.16.154:5000',
  },
};

const getEnv = (): EnvType => {
  const mode = import.meta.env.MODE;
  return mode === 'production' ? 'online' : 'test';
};

export const config = envConfigs[getEnv()];
