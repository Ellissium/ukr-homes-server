import { IsArray, IsString } from 'class-validator'

export class TempPostDto {
	@IsString()
	name: string

	@IsArray()
	images: File[]
}
