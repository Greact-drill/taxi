import type { ErrorCode, Result } from '@packages/shared';
import { socket } from './socket';

function fail(code: ErrorCode, message: string): Result<never> {
  return { ok: false, error: { code, message } };
}

export async function call<TPayload, TResponse>(
  event: string,
  payload: TPayload,
  opts?: { timeoutMs?: number },
): Promise<TResponse | Result<never>> {
  const timeoutMs = opts?.timeoutMs ?? 5000;
  try {
    const res = await socket.timeout(timeoutMs).emitWithAck(event, payload);
    return res as TResponse;
  } catch {
    return fail('BAD_REQUEST', 'No ack response (timeout or disconnected)');
  }
}

