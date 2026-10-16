import mongoose from "mongoose";

export class DatabaseConnectionError extends Error {
  constructor() {
    super(
      "MongoDB connection failed. Verify Atlas configuration and network access; connection details are withheld.",
    );
    this.name = "DatabaseConnectionError";
  }
}

export async function connectMongoose(uri, mongooseInstance = mongoose) {
  try {
    await mongooseInstance.connect(uri, { autoIndex: false });
    return {
      connection: mongooseInstance.connection,
      close: () => mongooseInstance.disconnect(),
    };
  } catch {
    try {
      await mongooseInstance.disconnect();
    } catch {
      // Keep driver and credential details out of startup errors.
    }
    throw new DatabaseConnectionError();
  }
}
