import { IsEnum, IsOptional, IsString } from 'class-validator'
import { PaginationDto } from 'src/pagination/dto/pagination.dto'

export enum EnumPostSort {
	HIGH_PRICE = 'high-price',
	LOW_PRICE = 'low-price',
	NEWEST = 'newest',
	OLDEST = 'oldest'
}

export class GetAllPostDto extends PaginationDto {
	@IsOptional()
	@IsEnum(EnumPostSort)
	sort?: string

	@IsOptional()
	@IsString()
	searchTerm?: string

	@IsOptional()
	@IsString()
	category?: string
}
