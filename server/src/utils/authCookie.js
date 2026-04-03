import crypto from "node:crypto";

const AUTH_COOKIE_NAME = "campus_auth";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const AUTH_COOKIE_MAX_AGE_MS = 7 * ONE_DAY_MS;
const JWT_ALGORITHM = "HS256";

function getAuthSecret() {
  const secret = process.env.AUTH_COOKIE_SECRET?.trim();
  return secret || "dev-auth-cookie-secret-change-me";
}

function encodeBase64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function decodeBase64Url(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signValue(value) {
  return crypto
    .createHmac("sha256", getAuthSecret())
    .update(value)
    .digest("base64url");
}

export function createAuthToken(payload) {
  const header = {
    alg: JWT_ALGORITHM,
    typ: "JWT",
  };
  const data = {
    ...payload,
    exp: Math.floor((Date.now() + AUTH_COOKIE_MAX_AGE_MS) / 1000),
  };
  const encodedHeader = encodeBase64Url(JSON.stringify(header));
  const encodedPayload = encodeBase64Url(JSON.stringify(data));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = signValue(signingInput);
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyAuthToken(token) {
  if (!token) {
    return null;
  }

  const [encodedHeader, encodedPayload, signature] = token.split(".");
  if (!encodedHeader || !encodedPayload || !signature) {
    return null;
  }

  let header;
  try {
    header = JSON.parse(decodeBase64Url(encodedHeader));
  } catch {
    return null;
  }

  if (header.alg !== JWT_ALGORITHM || header.typ !== "JWT") {
    return null;
  }

  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = signValue(signingInput);

  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedSignatureBuffer.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function parseCookies(cookieHeader = "") {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const separatorIndex = part.indexOf("=");
      if (separatorIndex === -1) {
        return acc;
      }

      const key = part.slice(0, separatorIndex).trim();
      const value = decodeURIComponent(part.slice(separatorIndex + 1).trim());
      acc[key] = value;
      return acc;
    }, {});
}

export function getAuthCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: AUTH_COOKIE_MAX_AGE_MS,
    path: "/",
  };
}

export function attachAuthCookie(res, payload) {
  const token = createAuthToken(payload);
  res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
  return token;
}

export function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE_NAME, {
    ...getAuthCookieOptions(),
    maxAge: undefined,
  });
}

export { AUTH_COOKIE_NAME };
