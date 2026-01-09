type EnvType = 'test' | 'online';

interface EnvConfig {
  baseURL: string;
}

const envConfigs: Record<EnvType, EnvConfig> = {
  test: {
    baseURL: 'http://test-api.example.com',
  },
  online: {
    baseURL: 'http://api.example.com',
  },
};

const getEnv = (): EnvType => {
  const mode = import.meta.env.MODE;
  return mode === 'production' ? 'online' : 'test';
};

export const config = envConfigs[getEnv()];
