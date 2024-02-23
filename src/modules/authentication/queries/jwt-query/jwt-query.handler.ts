import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { Jwt } from '../../domain/authentication.types';
import { JwtQuery } from './jwt-query';

@QueryHandler(JwtQuery)
export class JwtQueryHandler implements IQueryHandler {
  constructor(private readonly jwtService: JwtService) {}

  async execute(query: JwtQuery): Promise<Jwt> {
    return this.jwtService.signAsync({ id: query.id });
  }
}
