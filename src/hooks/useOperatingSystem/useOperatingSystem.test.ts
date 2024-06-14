import { renderHook } from '@testing-library/react';

import { useOperatingSystem } from './useOperatingSystem';

it('Should use operating system', () => {
  const { result } = renderHook(useOperatingSystem);
  expect(typeof result.current).toBe('string');
});

const userAgentAndExpectedOSs = [
  { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', expectedOS: 'macos' },
  { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)', expectedOS: 'ios' },
  { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', expectedOS: 'windows' },
  { userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5)', expectedOS: 'android' },
  { userAgent: 'Mozilla/5.0 (X11; Linux x86_64)', expectedOS: 'linux' },
  { userAgent: 'Mozilla/5.0 (Unknown)', expectedOS: 'undetermined' }
];

userAgentAndExpectedOSs.forEach((userAgentAndExpectedOS) => {
  it(`Should return ${userAgentAndExpectedOS.expectedOS} for user agent: ${userAgentAndExpectedOS.userAgent}`, () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockImplementation(
      () => userAgentAndExpectedOS.userAgent
    );

    const { result } = renderHook(useOperatingSystem);
    expect(result.current).toBe(userAgentAndExpectedOS.expectedOS);
  });
});
