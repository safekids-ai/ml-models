export interface JwtConfig {
  secretKey: string,
  secretKeyExpirationSeconds: number,
}

export default () => ({
  jwtConfig: {
    secretKey: process.env.JWTSECRET || 'jdhfkDGFKFH74638Djasdjks3873984',
    secretKeyExpirationSeconds: process.env.JWTEXPIRESECONDS || 3600,
  } as JwtConfig
});
