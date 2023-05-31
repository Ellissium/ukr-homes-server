import { IsArray, IsBoolean, IsString } from 'class-validator'

export class PostDto {
	@IsBoolean()
	activity: boolean

	@IsString()
	name: string

	@IsArray()
	images: string[]

	@IsString()
	description: string

	@IsString()
	price: string

	@IsString()
	utilitiesPrice: string

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

	@IsString()
	roomsNumber: string

	@IsString()
	bedsNumber: string

	@IsString()
	bathroomsNumber: string

	@IsString()
	floor: string

	@IsString()
	area: string

	@IsString()
	minRentalPeriod: string

	@IsString()
	categoryId: string

	@IsString()
	authorId: string
}
