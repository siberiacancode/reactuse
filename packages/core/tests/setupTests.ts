if (typeof document !== 'undefined') {
  const targetRoot = document.createElement('div');
  const target = document.createElement('div');

  targetRoot.id = 'target-root';

  target.id = 'target';
  target.tabIndex = 0;
  target.textContent = 'target';

  targetRoot.appendChild(target);
  document.body.appendChild(targetRoot);
}

afterEach(() => {
  vi.clearAllMocks();
  vi.resetAllMocks();
});
