import { IsUUID, IsString, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  buyer_id: string;

  @IsUUID()
  seller_id: string;

  @IsString()
  item: string;

  @IsNumber()
  amount: number;
}
