type EnvType = 'test' | 'online';

interface EnvConfig {
  baseURL: string;
}

const envConfigs: Record<EnvType, EnvConfig> = {
  test: {
    baseURL: 'http://localhost:5001',
  },
  online: {
    baseURL: 'http://localhost:5001',
  },
};

const getEnv = (): EnvType => {
  const mode = import.meta.env.MODE;
  return mode === 'production' ? 'online' : 'test';
};

export const config = envConfigs[getEnv()];
