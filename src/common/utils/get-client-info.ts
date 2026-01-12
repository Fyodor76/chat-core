import { Request } from 'express';

export function getClientInfo(req: Request) {
  return {
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
    source: 'website',
  };
}
