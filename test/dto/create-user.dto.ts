import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength
} from 'class-validator';

export class CreateUserDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
