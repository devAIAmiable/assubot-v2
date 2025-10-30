import { afterEach, describe, expect, it, vi } from 'vitest';

import { usersService } from './users';

const originalFetch = global.fetch;

afterEach(() => {
  vi.clearAllMocks();
  global.fetch = originalFetch as unknown as typeof fetch;
});

describe('usersService.batchCreate', () => {
  it('returns success with parsed resource', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        status: 'success',
        message: 'Batch user creation completed: 1 succeeded, 0 failed',
        results: [{ success: true, email: 'ok@example.com', userId: 'u1', error: null }],
        summary: { total: 1, successCount: 1, failureCount: 0, initialCredits: 100 },
      }),
    });

    const res = await usersService.batchCreate({
      initialCredits: 100,
      users: [{ email: 'ok@example.com', password: 'password123', firstName: 'Jean', lastName: 'Dupont' }],
    });

    expect(res.success).toBe(true);
    expect(res.data?.resource?.summary.successCount).toBe(1);
  });

  it('returns error on server error', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ status: 'error', error: { code: '500', message: 'Server error' } }),
    });

    const res = await usersService.batchCreate({
      initialCredits: 0,
      users: [{ email: 'x@example.com', password: 'password123', firstName: 'X', lastName: 'Y' }],
    });

    expect(res.success).toBe(false);
    expect(res.error).toBeTruthy();
  });
});
