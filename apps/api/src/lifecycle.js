import { createApp } from "./app.js";
import { connectMongoose } from "./database/mongoose.js";
export class ApiStartupError extends Error {
  constructor() {
    super(
      "Dentora API could not start. Check required configuration and MongoDB connectivity.",
    );
    this.name = "ApiStartupError";
  }
}
function closeServer(server) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => server.closeAllConnections(), 10_000);
    timeout.unref();
    server.close((error) => {
      clearTimeout(timeout);
      if (error) reject(error);
      else resolve();
    });
  });
}
export async function startApi(config, dependencies = {}) {
  if (config.environment !== "test" && !config.mongoUri)
    throw new ApiStartupError();
  let databaseConnection;
  let server;
  try {
    if (config.environment !== "test" && config.mongoUri) {
      databaseConnection = await (
        dependencies.connectDatabase ?? connectMongoose
      )(config.mongoUri);
    }
    const app = (
      dependencies.buildApp ?? ((webOrigin) => createApp({ webOrigin }))
    )(config.webOrigin);
    server = app.listen(config.port, "127.0.0.1");
    await new Promise((resolve, reject) => {
      const onListening = () => {
        server?.off("error", onError);
        resolve();
      };
      const onError = (error) => {
        server?.off("listening", onListening);
        reject(error);
      };
      server?.once("listening", onListening);
      server?.once("error", onError);
    });
    let shutdownPromise;
    const runtime = {
      app,
      server,
      ...(databaseConnection ? { databaseConnection } : {}),
      shutdown: () => {
        shutdownPromise ??= (async () => {
          let closeError;
          try {
            await closeServer(server);
          } catch (error) {
            closeError = error;
          }
          try {
            await databaseConnection?.close();
          } catch (error) {
            closeError ??= error;
          }
          if (closeError) throw new ApiStartupError();
        })();
        return shutdownPromise;
      },
    };
    return runtime;
  } catch {
    if (server?.listening) {
      try {
        await closeServer(server);
      } catch {
        // Startup failure remains generic and cleanup is best-effort.
      }
    }
    try {
      await databaseConnection?.close();
    } catch {
      // Never include driver details in a startup error.
    }
    throw new ApiStartupError();
  }
}
