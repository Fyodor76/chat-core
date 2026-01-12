import { IsArray, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface DirectChatData {
  memberIds: [string, string];
}

export class CreateDirectChatDto {
  @ApiProperty({
    description: 'ID участников прямого чата (ровно 2)',
    type: [String],
    example: ['user-1', 'user-2'],
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  memberIds: string[];
}
