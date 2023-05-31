import { IsOptional, IsString } from 'class-validator'
import { PaginationDto } from 'src/pagination/dto/pagination.dto'

// export enum EnumPostSort {
// 	HIGH_PRICE = 'high-price',
// 	LOW_PRICE = 'low-price',
// 	NEWEST = 'newest',
// 	OLDEST = 'oldest'
// }
export type EnumValue = {
	key: string
	value: string
}
export const PostSortEnum: EnumValue[] = [
	{ key: 'HIGH_PRICE', value: 'Найдорожчі' },
	{ key: 'LOW_PRICE', value: 'Найдешевші' },
	{ key: 'NEWEST', value: 'Найновіші' },
	{ key: 'OLDEST', value: 'Найстаріші' }
]

export class GetAllPostDto extends PaginationDto {
	@IsOptional()
	@IsString()
	user?: string

	@IsOptional()
	@IsString()
	sort?: string

	@IsOptional()
	@IsString()
	searchTerm?: string

	@IsOptional()
	@IsString()
	category?: string

	@IsOptional()
	@IsString()
	minPrice?: string

	@IsOptional()
	@IsString()
	maxPrice?: string

	@IsOptional()
	@IsString()
	minArea?: string

	@IsOptional()
	@IsString()
	maxArea?: string

	@IsOptional()
	@IsString()
	minFloor?: string

	@IsOptional()
	@IsString()
	maxFloor?: string

	@IsOptional()
	@IsString()
	minRooms?: string

	@IsOptional()
	@IsString()
	maxRooms?: string

	@IsOptional()
	@IsString()
	minRent?: string

	@IsOptional()
	@IsString()
	maxRent?: string

	@IsOptional()
	@IsString()
	minBeds?: string

	@IsOptional()
	@IsString()
	maxBeds?: string

	@IsOptional()
	@IsString()
	minBathRooms?: string

	@IsOptional()
	@IsString()
	maxBathRooms?: string

	@IsOptional()
	@IsString()
	region?: string
}
