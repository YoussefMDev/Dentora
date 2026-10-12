export interface ApiConfig {
  port: number;
  webOrigin: string;
  environment: 'development' | 'test' | 'production';
}

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): ApiConfig {
  const rawPort = environment['API_PORT'] ?? '3000';
  const port = Number(rawPort);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('API_PORT must be a valid TCP port.');
  }

  const webOrigin = environment['WEB_ORIGIN'] ?? 'http://localhost:4200';
  let parsedOrigin: URL;
  try {
    parsedOrigin = new URL(webOrigin);
  } catch {
    throw new Error('WEB_ORIGIN must be an exact http(s) origin.');
  }
  if (
    !['http:', 'https:'].includes(parsedOrigin.protocol) ||
    parsedOrigin.origin !== webOrigin
  ) {
    throw new Error('WEB_ORIGIN must be an exact http(s) origin without a path.');
  }

  const environmentName = environment['NODE_ENV'] ?? 'development';
  if (!['development', 'test', 'production'].includes(environmentName)) {
    throw new Error('NODE_ENV must be development, test, or production.');
  }

  return {
    port,
    webOrigin,
    environment: environmentName as ApiConfig['environment'],
  };
}
