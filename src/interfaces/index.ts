import { Request } from 'express';
import { User } from '@prisma/client';

interface Session {
  user: User;
  [key: string]: any;
}

export interface AuthenticatedRequest extends Request {
  session: Session;
}