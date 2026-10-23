// Pure helpers for the Cal.com booker, shared by the client embed and server routes (llms.txt).

/** "user/event", "/user/event/" or "https://cal.com/user/event" to the booker's two ids. */
export function parseCalLink(link: string): { username: string; eventSlug: string } | null {
  const path = link.trim().replace(/^https?:\/\/[^/]+/i, '');
  const [username, eventSlug] = path.split('/').filter(Boolean);
  return username && eventSlug ? { username, eventSlug } : null;
}
