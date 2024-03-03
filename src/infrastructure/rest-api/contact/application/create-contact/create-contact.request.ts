import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateContactRequest {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly firstName?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly lastName?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly phone?: string;
}
