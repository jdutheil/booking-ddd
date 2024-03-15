import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrganizerType } from '@src/domains/contacts/organizer/domain/organizer.entity';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateOrganizerRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly name!: string;

  @ApiProperty()
  @IsEnum(OrganizerType)
  @IsNotEmpty()
  readonly type!: OrganizerType;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  readonly emails?: string[];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  readonly phones?: string[];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true })
  readonly contactIds?: string[];
}
