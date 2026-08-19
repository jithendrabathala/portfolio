export function GET(request: Request) {
  const { search } = new URL(request.url);

  return new Response(null, {
    status: 307,
    headers: { Location: `/${search}` },
  });
}

export const HEAD = GET;
