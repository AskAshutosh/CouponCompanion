import * as Clipboard from 'expo-clipboard';

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await Clipboard.setStringAsync(text);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
  }
};