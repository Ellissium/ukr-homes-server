import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class UserDto {
	@IsEmail()
	email: string

	@IsOptional()
	@MinLength(8, {
		message: 'password must be at least 8 characters long'
	})
	@IsOptional()
	@IsString()
	password: string

	@IsOptional()
	@IsString()
	name: string

	@IsOptional()
	@IsString()
	avatarPath: string

	@IsOptional()
	@IsString()
	phone: string
}
