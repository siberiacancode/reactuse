if (typeof document !== 'undefined') {
  const target = document.createElement('div');
  target.id = 'target';
  target.tabIndex = 0;
  target.textContent = 'target';
  document.body.appendChild(target);
}

afterEach(() => {
  vi.clearAllMocks();
  vi.resetAllMocks();
});
