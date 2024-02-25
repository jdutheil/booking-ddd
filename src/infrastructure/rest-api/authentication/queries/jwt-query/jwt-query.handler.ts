import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  JWT_SERVICE,
  JwtServicePort,
  Tokens,
} from '../../application/ports/jwt-service.port';
import { JwtQuery } from './jwt-query';

@QueryHandler(JwtQuery)
export class JwtQueryHandler implements IQueryHandler {
  constructor(
    @Inject(JWT_SERVICE)
    private readonly jwtService: JwtServicePort,
  ) {}

  async execute(query: JwtQuery): Promise<Tokens> {
    return this.jwtService.getTokens(query.id);
  }
}
