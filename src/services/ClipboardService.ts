// Function to copy text to clipboard
export const copyToClipboard = (text: string): void => {
  // Modern browsers
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .catch(err => {
        console.error('Failed to copy text: ', err);
        fallbackCopyToClipboard(text);
      });
  } else {
    // Fallback for older browsers
    fallbackCopyToClipboard(text);
  }
};

// Fallback method using document.execCommand (deprecated but still works in some browsers)
const fallbackCopyToClipboard = (text: string): void => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  
  // Make the textarea out of viewport
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (!successful) {
      console.error('Fallback: Copying text failed');
    }
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }
  
  document.body.removeChild(textArea);
};
