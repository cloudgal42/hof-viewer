export async function shareContent(content: {
  title: string;
  text?: string;
  url: string;
}) {
  try {
    await navigator.share(content);
  } catch (err) {
    // FIXME
    if (err instanceof Error && err.name !== "AbortError") {
      console.warn(`Failed to initiate share: ${err.message}\nReverting to fallback copy to clipboard.`);
      try {
        await navigator.clipboard.writeText(content.url);
        alert("Copied link to clipboard!");
      } catch (err) {
        console.error(err);
        if (err instanceof Error) alert(`Failed to copy to user clipboard: ${err.message}`);
      }
    }
  }
}