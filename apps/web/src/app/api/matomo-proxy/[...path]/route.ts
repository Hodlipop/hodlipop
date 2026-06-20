import { createMatomoProxyHandler } from "@socialgouv/matomo-next";

const { GET: matomoGet, POST: matomoPost } = createMatomoProxyHandler();

type RouteContext = {
  params: Promise<{ path?: string[] }>;
};

async function proxy(request: Request, context: RouteContext): Promise<Response> {
  const response = await matomoGet(request, context);

  // OpenNext/Lambda may report content-length: 0 while streaming the body.
  // Buffer the upstream response so browsers receive a complete script.
  if (response.ok && response.body) {
    const body = await response.arrayBuffer();
    const headers = new Headers(response.headers);
    headers.set("content-length", String(body.byteLength));
    return new Response(body, { status: response.status, headers });
  }

  return response;
}

export async function GET(request: Request, context: RouteContext): Promise<Response> {
  return proxy(request, context);
}

export async function POST(request: Request, context: RouteContext): Promise<Response> {
  const response = await matomoPost(request, context);
  if (response.ok && response.body) {
    const body = await response.arrayBuffer();
    const headers = new Headers(response.headers);
    headers.set("content-length", String(body.byteLength));
    return new Response(body, { status: response.status, headers });
  }
  return response;
}
