import { IsEmail, IsString, MinLength } from 'class-validator'

export class RegisterDto {
	@IsString()
	name: string

	@IsEmail()
	email: string

	@MinLength(8, {
		message: 'password must be at least 8 characters long'
	})
	@IsString()
	password: string
}

export class LoginDto {
	@IsEmail()
	email: string

	@MinLength(8, {
		message: 'password must be at least 8 characters long'
	})
	@IsString()
	password: string
}
