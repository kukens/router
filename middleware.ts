const LOCAL_HOSTNAMES = new Set(["127.0.0.1", "::1", "localhost"]);

function shouldSkipBasicAuth(request: Request) {
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  const { hostname } = new URL(request.url);

  return LOCAL_HOSTNAMES.has(hostname);
}

function getBasicAuthCredentials() {
  const username = process.env.BASIC_AUTH_USERNAME;
  const password = process.env.BASIC_AUTH_PASSWORD;

  if (!username || !password) {
    return null;
  }

  return { password, username };
}

function requestHasValidBasicAuth(
  request: Request,
  credentials: NonNullable<ReturnType<typeof getBasicAuthCredentials>>,
) {
  const authorizationHeader = request.headers.get("authorization");

  if (!authorizationHeader?.startsWith("Basic ")) {
    return false;
  }

  try {
    const encodedCredentials = authorizationHeader.slice("Basic ".length).trim();
    const decodedCredentials = atob(encodedCredentials);
    const separatorIndex = decodedCredentials.indexOf(":");

    if (separatorIndex === -1) {
      return false;
    }

    const username = decodedCredentials.slice(0, separatorIndex);
    const password = decodedCredentials.slice(separatorIndex + 1);

    return (
      username === credentials.username && password === credentials.password
    );
  } catch {
    return false;
  }
}

function createBasicAuthChallengeResponse() {
  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "Cache-Control": "no-store",
      "WWW-Authenticate": 'Basic realm="Protected", charset="UTF-8"',
    },
  });
}

export default function middleware(request: Request) {
  if (shouldSkipBasicAuth(request)) {
    return;
  }

  const credentials = getBasicAuthCredentials();

  if (!credentials) {
    return;
  }

  if (!requestHasValidBasicAuth(request, credentials)) {
    return createBasicAuthChallengeResponse();
  }

  return;
}

export const config = {
  matcher: ["/:path*"],
};
