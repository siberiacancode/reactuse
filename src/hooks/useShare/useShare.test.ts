import { renderHook } from '@testing-library/react';

import { useShare } from './useShare';

const mockNavigatorShare = vi.fn();
const mockNavigatorCanShare = vi.fn();
Object.assign(navigator, {
  canShare: mockNavigatorCanShare,
  share: mockNavigatorShare
});

it('Should use share', () => {
  const { result } = renderHook(useShare);

  expect(typeof result.current.share).toBe('function');
  expect(result.current.supported).toBe(true);
});

// it('Should use share on server side', () => {
//   const { result } = renderHookServer(useShare);

//   expect(result.current.supported).toBe(false);
// });

it('Should share data', () => {
  const { result } = renderHook(useShare);

  result.current.share({ title: 'title', text: 'text', url: 'url' });
  expect(mockNavigatorShare).toHaveBeenCalledWith({ title: 'title', text: 'text', url: 'url' });

  mockNavigatorCanShare.mockReturnValue(true);
  result.current.share({ title: 'title', text: 'text', url: 'url', files: [] });
  expect(mockNavigatorCanShare).toHaveBeenCalledOnce();
  expect(mockNavigatorShare).toHaveBeenCalledWith({
    title: 'title',
    text: 'text',
    url: 'url',
    files: []
  });
});
