/** Public origin for redirects behind a reverse proxy (e.g. DigitalOcean App Platform). */
export function getPublicOrigin(request: Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost?.split(",")[0]?.trim() ?? request.headers.get("host");

  if (!host) {
    return new URL(request.url).origin;
  }

  const forwardedProto = request.headers.get("x-forwarded-proto");
  const proto =
    forwardedProto?.split(",")[0]?.trim() ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

  return `${proto}://${host}`;
}

export function publicRedirect(request: Request, pathname: string) {
  return new URL(pathname, getPublicOrigin(request)).toString();
}
