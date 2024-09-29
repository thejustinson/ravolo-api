import * as crypto from "crypto";

// Helper function to generate a simple wallet address
export function generateWalletAddress(): string {
  return crypto.randomBytes(20).toString("hex");
}
