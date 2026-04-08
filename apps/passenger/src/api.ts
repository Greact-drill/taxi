import type { ErrorCode, Result, AuthRegisterResponse, AuthRegisterPayload, MeGetPayload, MeGetResponse } from '@packages/shared';
import { socket } from './socket';

const TIMEOUT_MS = 5000;

function fail(code: ErrorCode, message: string): Result<never> {
  return { ok: false, error: { code, message } };
}

export async function call<TPayload, TResponse>(
  event: string,
  payload?: TPayload
): Promise<Result<TResponse>> {
  try {
    const res = await socket.timeout(TIMEOUT_MS).emitWithAck(event, payload);
    return res as Result<TResponse>;
  } catch {
    return fail('BAD_REQUEST', 'No ack response (timeout or disconnected)');
  }
}

export const api = {
  register: (payload: AuthRegisterPayload) => call<AuthRegisterPayload, AuthRegisterResponse>('auth:register', payload),
  me: () => call<MeGetPayload, MeGetResponse>('me:get'),
};