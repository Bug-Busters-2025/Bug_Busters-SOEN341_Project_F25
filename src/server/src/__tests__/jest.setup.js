// to bypass clerk in the tests
jest.mock('@clerk/express', () => ({
  clerkMiddleware: () => (_req, _res, next) => next(),
  requireAuth:   () => (_req, _res, next) => next(),
  getAuth:       () => ({ userId: 'test-user' }),
}));
