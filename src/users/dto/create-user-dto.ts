import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

	@IsString() 
	displayName: string;

	@IsString()
	avatar: string;
}
