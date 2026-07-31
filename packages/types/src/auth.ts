
export interface CustomJwtSessionClaims {
  metadata?: {
    role?: "user" | "admin";
  };
}