import { IsArray, IsBoolean, IsNumber, IsString, Min } from 'class-validator'

export class PostDto {
	@IsBoolean()
	activity: boolean

	@IsString()
	name: string

	@IsArray()
	images: string[]

	@IsString()
	description: string

	@IsNumber()
	price: number

	@IsNumber()
	utilitiesPrice: number

	@IsString()
	region: string

	@IsString()
	city: string

	@IsString()
	street: string

	@IsString()
	houseNumber: string

	@IsString()
	mapCoordinates: string

	@IsNumber()
	roomsNumber: number

	@IsNumber()
	bedsNumber: number

	@IsNumber()
	bathroomsNumber: number

	@IsNumber()
	floor: number

	@IsNumber()
	area: number

	@IsNumber()
	@Min(1)
	minRentalPeriod: number

	@IsNumber()
	categoryId: number

	@IsNumber()
	authorId: number
}
