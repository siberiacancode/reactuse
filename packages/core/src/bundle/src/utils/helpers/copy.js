export const legacyCopyToClipboard = (value) => {
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = value;
  tempTextArea.readOnly = true;
  tempTextArea.style.fontSize = '16px';
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextArea);
};
export const copy = async (value) => {
  try {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return legacyCopyToClipboard(value);
    }
  } catch {
    return legacyCopyToClipboard(value);
  }
};
