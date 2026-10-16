import { describe, expect, it } from "vitest";
import { PasswordRecoveryToken } from "../src/models/password-recovery-token.js";
import { StaffAccount } from "../src/models/staff-account.js";
import { StaffInvitation } from "../src/models/staff-invitation.js";

const now = new Date("2026-01-01T12:00:00.000Z");
const passwordHash = "$argon2id$v=19$m=65536,t=3,p=4$c2FsdA$aGFzaA";
const tokenHash = "a".repeat(64);

describe("StaffAccount schema", () => {
  it("requires normalized email, Argon2id hash, role, and verified email date", async () => {
    const account = new StaffAccount({
      email: " Staff@Example.com ",
      passwordHash,
      role: "Staff",
      emailVerifiedAt: now,
    });

    await expect(account.validate()).resolves.toBeUndefined();
    expect(account.email).toBe("staff@example.com");
    expect(StaffAccount.schema.indexes()).toContainEqual([
      { email: 1 },
      { unique: true },
    ]);
    expect(StaffAccount.schema.options.autoIndex).toBe(false);
  });

  it("rejects unsupported roles and non-Argon2id password values", async () => {
    const account = new StaffAccount({
      email: "staff@example.com",
      passwordHash: "plaintext-password",
      role: "Owner",
      emailVerifiedAt: now,
    });

    await expect(account.validate()).rejects.toMatchObject({
      errors: expect.objectContaining({
        role: expect.anything(),
        passwordHash: expect.anything(),
      }),
    });
  });
});

describe("staff token schemas", () => {
  it("requires a hashed expiring invitation tied to its inviter", async () => {
    const invitation = new StaffInvitation({
      email: "staff@example.com",
      role: "Admin",
      tokenHash,
      expiresAt: now,
      invitedBy: "65b000000000000000000001",
    });

    await expect(invitation.validate()).resolves.toBeUndefined();
    expect(invitation.acceptedAt).toBeNull();
    expect(StaffInvitation.schema.indexes()).toContainEqual([
      { tokenHash: 1 },
      { unique: true },
    ]);
    expect(StaffInvitation.schema.indexes()).toContainEqual([
      { expiresAt: 1 },
      { expireAfterSeconds: 0 },
    ]);
    expect(StaffInvitation.schema.options.autoIndex).toBe(false);
  });

  it("rejects raw invitation tokens and persists only token digests", async () => {
    const invitation = new StaffInvitation({
      email: "staff@example.com",
      role: "Staff",
      tokenHash: "raw-token-value",
      expiresAt: now,
      invitedBy: "65b000000000000000000001",
    });

    await expect(invitation.validate()).rejects.toMatchObject({
      errors: expect.objectContaining({ tokenHash: expect.anything() }),
    });
  });

  it("requires an expiring single-use recovery token associated with a staff account", async () => {
    const recoveryToken = new PasswordRecoveryToken({
      staffAccount: "65b000000000000000000002",
      tokenHash,
      expiresAt: now,
    });

    await expect(recoveryToken.validate()).resolves.toBeUndefined();
    expect(recoveryToken.usedAt).toBeNull();
    expect(PasswordRecoveryToken.schema.indexes()).toContainEqual([
      { tokenHash: 1 },
      { unique: true },
    ]);
    expect(PasswordRecoveryToken.schema.indexes()).toContainEqual([
      { expiresAt: 1 },
      { expireAfterSeconds: 0 },
    ]);
    expect(PasswordRecoveryToken.schema.options.autoIndex).toBe(false);
  });
});
