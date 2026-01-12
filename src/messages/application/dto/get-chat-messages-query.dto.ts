import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetChatMessagesQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  @Transform(({ value }) => (value ? parseInt(value, 10) : 50))
  limit?: number = 50;
}
