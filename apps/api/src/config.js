export function loadConfig(environment = process.env) {
  const environmentName = environment["NODE_ENV"] ?? "development";
  if (!["development", "test", "production"].includes(environmentName)) {
    throw new Error("NODE_ENV must be development, test, or production.");
  }
  const rawPort = environment["API_PORT"] ?? "3000";
  const port = Number(rawPort);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("API_PORT must be a valid TCP port.");
  }
  const webOrigin =
    environment["WEB_ORIGIN"] ??
    (environmentName === "production" ? undefined : "http://localhost:4200");
  if (!webOrigin) {
    throw new Error("WEB_ORIGIN must be configured in production.");
  }
  let parsedOrigin;
  try {
    parsedOrigin = new URL(webOrigin);
  } catch {
    throw new Error("WEB_ORIGIN must be an exact http(s) origin.");
  }
  if (
    !["http:", "https:"].includes(parsedOrigin.protocol) ||
    parsedOrigin.origin !== webOrigin
  ) {
    throw new Error(
      "WEB_ORIGIN must be an exact http(s) origin without a path.",
    );
  }
  if (environmentName === "production" && parsedOrigin.protocol !== "https:") {
    throw new Error("WEB_ORIGIN must use HTTPS in production.");
  }
  const mongoUri = environment["MONGODB_URI"];
  if (mongoUri === undefined && environmentName !== "test") {
    throw new Error(
      "MONGODB_URI must be configured outside the test environment.",
    );
  }
  if (mongoUri !== undefined) {
    let parsedMongoUri;
    try {
      if (mongoUri.trim() !== mongoUri) throw new Error();
      parsedMongoUri = new URL(mongoUri);
    } catch {
      throw new Error("MONGODB_URI must be a valid MongoDB connection string.");
    }
    if (
      !["mongodb:", "mongodb+srv:"].includes(parsedMongoUri.protocol) ||
      !parsedMongoUri.hostname ||
      parsedMongoUri.hash
    ) {
      throw new Error("MONGODB_URI must be a valid MongoDB connection string.");
    }
  }
  return {
    port,
    webOrigin,
    environment: environmentName,
    ...(mongoUri === undefined ? {} : { mongoUri }),
  };
}
