import { renderHook } from '@testing-library/react';

import { useOperatingSystem } from './useOperatingSystem';

const mockNavigatorUserAgent = vi.spyOn(navigator, 'userAgent', 'get');

it('Should use operating system', () => {
  const { result } = renderHook(useOperatingSystem);
  expect(typeof result.current).toBe('string');
});

const USER_AGENTS = [
  { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', operatingSystem: 'macos' },
  { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)', operatingSystem: 'ios' },
  { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', operatingSystem: 'windows' },
  { userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5)', operatingSystem: 'android' },
  { userAgent: 'Mozilla/5.0 (X11; Linux x86_64)', operatingSystem: 'linux' },
  { userAgent: 'Mozilla/5.0 (Unknown)', operatingSystem: 'undetermined' }
];

USER_AGENTS.forEach(({ userAgent, operatingSystem }) => {
  it(`Should return ${operatingSystem} for user agent: ${userAgent}`, () => {
    mockNavigatorUserAgent.mockReturnValue(userAgent);

    const { result } = renderHook(useOperatingSystem);
    expect(result.current).toBe(operatingSystem);
  });
});
