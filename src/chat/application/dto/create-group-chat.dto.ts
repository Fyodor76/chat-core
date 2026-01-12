import {
  IsArray,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface GroupChatData {
  memberIds: string[];
  name: string;
  avatar: string | null;
}

export class CreateGroupChatDto {
  @ApiProperty({
    description: 'ID участников группового чата',
    type: [String],
    example: ['user-1', 'user-2', 'user-3'],
  })
  @IsArray()
  @ArrayMinSize(2)
  memberIds: string[];

  @ApiProperty({
    description: 'Название группового чата',
    example: 'Моя команда',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'ID участников группового чата',
    type: String,
    example: 'user-1',
  })
  @IsString()
  creatorId: string;

  @ApiProperty({
    description: 'Ссылка на аватар чата (опционально)',
    required: false,
    example: 'https://example.com/avatar.png',
  })
  @IsOptional()
  @IsString()
  avatar?: string;
}
