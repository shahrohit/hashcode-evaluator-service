export default function formatSingleQuote(str: string) {
  return str.replace(/'/g, `'\\''`);
}
