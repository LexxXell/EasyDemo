export function sanitizeUser(user: any) {
  const {
    id,
    role,
    username,
    email,
    provider,
    password,
    resetPasswordToken,
    confirmationToken,
    confirmed,
    blocked,
    tgOAuthToken,
    telegram_id,
    createdAt,
    updatedAt,
    ...userSanitized
  } = user;
  return userSanitized;
}
