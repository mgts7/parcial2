import { IsString, IsInt, IsEnum, Min, Max } from 'class-validator';

export enum ContestantStatus {
  ALIVE = 'Alive',
  DEAD = 'Dead',
  ESCAPED = 'Escaped',
  FREE = 'Free',
}

export class CreateContestantDto {
  @IsString()
  name: string;

  @IsString()
  nickname: string;

  @IsString()
  origin: string;

  @IsInt()
  @Min(1)
  @Max(100)
  strength: number;

  @IsInt()
  @Min(1)
  @Max(100)
  agility: number;

  @IsInt()
  wins: number;

  @IsInt()
  losses: number;

  @IsEnum(ContestantStatus)
  status: ContestantStatus;
}
