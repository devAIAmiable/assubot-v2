export const cleanAssistantMessage = (content: string): string => {
  const patterns = [/Document\(s\) utilisé.*$/is, /Documents? utilisés?.*$/is];

  let cleanedContent = content;
  for (const pattern of patterns) {
    cleanedContent = cleanedContent.replace(pattern, '');
  }

  return cleanedContent.trim();
};
