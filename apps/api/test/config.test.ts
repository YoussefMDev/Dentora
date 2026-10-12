import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config.js';

describe('API configuration', () => {
  it('uses safe local defaults outside production', () => {
    expect(loadConfig({}).webOrigin).toBe('http://localhost:4200');
  });

  it('rejects invalid ports and environment names', () => {
    expect(() => loadConfig({ API_PORT: '0' })).toThrow('API_PORT must be a valid TCP port.');
    expect(() => loadConfig({ NODE_ENV: 'staging' })).toThrow(
      'NODE_ENV must be development, test, or production.',
    );
  });

  it('requires an explicit HTTPS origin in production', () => {
    expect(() => loadConfig({ NODE_ENV: 'production' })).toThrow(
      'WEB_ORIGIN must be configured in production.',
    );
    expect(() =>
      loadConfig({ NODE_ENV: 'production', WEB_ORIGIN: 'http://dentora.example' }),
    ).toThrow('WEB_ORIGIN must use HTTPS in production.');
    expect(
      loadConfig({ NODE_ENV: 'production', WEB_ORIGIN: 'https://dentora.example' }).webOrigin,
    ).toBe('https://dentora.example');
  });

  it('rejects non-exact origins with paths or extra URL components', () => {
    expect(() => loadConfig({ WEB_ORIGIN: 'http://localhost:4200/app' })).toThrow(
      'WEB_ORIGIN must be an exact http(s) origin without a path.',
    );
    expect(() => loadConfig({ WEB_ORIGIN: 'http://localhost:4200/' })).toThrow(
      'WEB_ORIGIN must be an exact http(s) origin without a path.',
    );
  });
});
