export type ClientRole = 'passenger' | 'dispatcher';

export interface ConnectionInfo {
  clientId: string;
  role: ClientRole;
}
