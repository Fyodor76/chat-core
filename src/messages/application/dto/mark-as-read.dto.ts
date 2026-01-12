import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarkAsReadDto {
  @ApiProperty({
    description: 'ID пользователя, который отмечает как прочитанное',
    example: '9e56dde4-809e-49f8-bc19-b4c0a497b581',
  })
  @IsString()
  userId: string;
}
