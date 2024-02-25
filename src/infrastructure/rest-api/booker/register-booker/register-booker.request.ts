import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterBookerRequest {
  @ApiProperty({
    example: 'john.doe@gmail.com',
    description: 'Booker email address',
  })
  @MinLength(5)
  @MaxLength(255)
  @IsEmail()
  readonly email!: string;

  @ApiProperty({
    example: '$tr0ngP@ssw0rd',
    description:
      'Booker password - must be strong password (min 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character)',
  })
  @MinLength(8)
  @MaxLength(100)
  @IsString()
  @IsStrongPassword()
  readonly password!: string;
}
