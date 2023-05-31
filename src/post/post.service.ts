import { faker } from '@faker-js/faker'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import slugify from 'slugify'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { GetAllPostDto, PostSortEnum } from './dto/get-all.post.dto'
import { PostDto } from './dto/post.dto'
import { returnPostObject } from './return-post.object'
@Injectable()
export class PostService {
	constructor(
		private prismaService: PrismaService,
		private paginationService: PaginationService
	) {}

	async getAll(dto: GetAllPostDto = {}) {
		const {
			user,
			sort,
			searchTerm,
			category,
			minPrice,
			maxPrice,
			minArea,
			maxArea,
			minFloor,
			maxFloor,
			minRooms,
			maxRooms,
			minRent,
			maxRent,
			minBeds,
			maxBeds,
			minBathRooms,
			maxBathRooms,
			region
		} = dto

		const prismaSort: Prisma.PostOrderByWithRelationInput[] = []

		switch (sort) {
			case PostSortEnum.find(item => item.key === 'LOW_PRICE')?.key:
				prismaSort.push({ price: 'asc' })
				break
			case PostSortEnum.find(item => item.key === 'HIGH_PRICE')?.key:
				prismaSort.push({ price: 'desc' })
				break
			case PostSortEnum.find(item => item.key === 'OLDEST')?.key:
				prismaSort.push({ createdAt: 'asc' })
				break
			default:
				prismaSort.push({ createdAt: 'desc' })
				break
		}

		const prismaSearchTermFilter: Prisma.PostWhereInput = searchTerm
			? {
					OR: [
						{
							category: {
								name: {
									contains: searchTerm,
									mode: 'insensitive'
								}
							}
						},
						{
							name: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						},
						{
							description: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						}
					]
			  }
			: {}

		const prismaUserFilter: Prisma.PostWhereInput = user
			? {
					authorId: {
						equals: +user
					}
			  }
			: {}

		const prismaRegionFilter: Prisma.PostWhereInput =
			region !== undefined && region !== 'ALL'
				? {
						region: {
							equals: region,
							mode: 'insensitive'
						}
				  }
				: {}

		const prismaPriceFilter: Prisma.PostWhereInput = {}
		if (minPrice !== undefined && maxPrice !== undefined) {
			prismaPriceFilter.price = {
				gte: +minPrice,
				lte: +maxPrice
			}
		} else if (minPrice !== undefined) {
			prismaPriceFilter.price = {
				gte: +minPrice
			}
		} else if (maxPrice !== undefined) {
			prismaPriceFilter.price = {
				lte: +maxPrice
			}
		}

		const prismaAreaFilter: Prisma.PostWhereInput = {}
		if (minArea !== undefined && maxArea !== undefined) {
			prismaAreaFilter.area = {
				gte: +minArea,
				lte: +maxArea
			}
		} else if (minArea !== undefined) {
			prismaAreaFilter.area = {
				gte: +minArea
			}
		} else if (maxArea !== undefined) {
			prismaAreaFilter.area = {
				lte: +maxArea
			}
		}

		const prismaFloorFilter: Prisma.PostWhereInput = {}
		if (minFloor !== undefined && maxFloor !== undefined) {
			prismaFloorFilter.floor = {
				gte: +minFloor,
				lte: +maxFloor
			}
		} else if (minFloor !== undefined) {
			prismaFloorFilter.floor = {
				gte: +minFloor
			}
		} else if (maxFloor !== undefined) {
			prismaFloorFilter.floor = {
				lte: +maxFloor
			}
		}

		const prismaRoomsFilter: Prisma.PostWhereInput = {}
		if (minRooms !== undefined && maxRooms !== undefined) {
			prismaRoomsFilter.roomsNumber = {
				gte: +minRooms,
				lte: +maxRooms
			}
		} else if (minRooms !== undefined) {
			prismaRoomsFilter.roomsNumber = {
				gte: +minRooms
			}
		} else if (maxRooms !== undefined) {
			prismaRoomsFilter.roomsNumber = {
				lte: +maxRooms
			}
		}

		const prismaRentFilter: Prisma.PostWhereInput = {}
		if (minRent !== undefined && maxRent !== undefined) {
			prismaRentFilter.minRentalPeriod = {
				gte: +minRent,
				lte: +maxRent
			}
		} else if (minRent !== undefined) {
			prismaRentFilter.minRentalPeriod = {
				gte: +minRent
			}
		} else if (maxRent !== undefined) {
			prismaRentFilter.minRentalPeriod = {
				lte: +maxRent
			}
		}

		const prismaBedsFilter: Prisma.PostWhereInput = {}
		if (minBeds !== undefined && maxBeds !== undefined) {
			prismaBedsFilter.bedsNumber = {
				gte: +minBeds,
				lte: +maxBeds
			}
		} else if (minBeds !== undefined) {
			prismaBedsFilter.bedsNumber = {
				gte: +minBeds
			}
		} else if (maxBeds !== undefined) {
			prismaBedsFilter.bedsNumber = {
				lte: +maxBeds
			}
		}

		const prismaBathRoomsFilter: Prisma.PostWhereInput = {}
		if (minBathRooms !== undefined && maxBathRooms !== undefined) {
			prismaBathRoomsFilter.bathroomsNumber = {
				gte: +minBathRooms,
				lte: +maxBathRooms
			}
		} else if (minBathRooms !== undefined) {
			prismaBathRoomsFilter.bathroomsNumber = {
				gte: +minBathRooms
			}
		} else if (maxBathRooms !== undefined) {
			prismaBathRoomsFilter.bathroomsNumber = {
				lte: +maxBathRooms
			}
		}

		const prismaCategoryFilter: Prisma.PostWhereInput = category
			? {
					category: {
						name: {
							equals: category,
							mode: 'insensitive'
						}
					}
			  }
			: {}

		const { perPage, skip } = this.paginationService.getPagination(dto)

		const posts = await this.prismaService.post.findMany({
			where: {
				AND: [
					prismaSearchTermFilter,
					prismaCategoryFilter,
					prismaUserFilter,
					prismaPriceFilter,
					prismaAreaFilter,
					prismaFloorFilter,
					prismaRoomsFilter,
					prismaRentFilter,
					prismaBedsFilter,
					prismaBathRoomsFilter,
					prismaRegionFilter
				]
			},
			orderBy: prismaSort,
			skip,
			take: perPage,
			select: { ...returnPostObject }
		})

		return {
			posts,
			length: await this.prismaService.post.count({
				where: {
					AND: [
						prismaSearchTermFilter,
						prismaCategoryFilter,
						prismaUserFilter,
						prismaPriceFilter,
						prismaAreaFilter,
						prismaFloorFilter,
						prismaRoomsFilter,
						prismaRentFilter,
						prismaBedsFilter,
						prismaBathRoomsFilter,
						prismaRegionFilter
					]
				}
			})
		}
	}

	async byId(userId: number, postId: number) {
		console.log(userId)
		const postExists = await this.prismaService.post.findFirst({
			where: {
				id: postId,
				authorId: userId
			}
		})
		if (postExists) {
			const post = await this.prismaService.post.findUnique({
				where: {
					id: postId
				},
				select: returnPostObject
			})
			return post
		} else {
			throw new NotFoundException('Post not found')
		}
		// const post = await this.prismaService.post.findUnique({
		// 	where: { id, authorId: userId },
		// 	select: returnPostObject
		// })

		// if (!post)

		// return post
	}

	async bySlug(slug: string) {
		const post = await this.prismaService.post.findUnique({
			where: {
				slug
			},
			select: returnPostObject
		})

		if (!post) throw new NotFoundException('Post not found')

		return post
	}

	async byCategory(categorySlug: string) {
		const post = await this.prismaService.post.findMany({
			where: {
				category: {
					slug: categorySlug
				}
			},
			select: returnPostObject
		})

		if (!post) throw new NotFoundException('Post not found')

		return post
	}

	async getSimilar(userId: number, id: number) {
		const currentPost = await this.byId(userId, id)

		if (!currentPost) throw new NotFoundException('Current post not found')

		const posts = await this.prismaService.post.findMany({
			where: {
				category: {
					name: currentPost.category.name
				},
				NOT: {
					id: currentPost.id
				}
			},
			orderBy: {
				createdAt: 'desc'
			},
			select: returnPostObject
		})

		if (!posts) throw new NotFoundException('Post not found')

		return posts
	}

	async create(dto: PostDto, paths: string[]) {
		const postName = faker.commerce.productName()
		const slug = slugify(dto.name, { lower: true })
		const uniqueSlug = `${slug}-${Date.now()}`
		return this.prismaService.post.create({
			data: {
				activity: true,
				name: dto.name,
				slug: uniqueSlug,
				images: paths,
				description: dto.description,
				price: +dto.price,
				utilitiesPrice: +dto.utilitiesPrice,

				region: dto.region,
				city: dto.city,
				street: dto.street,
				houseNumber: dto.houseNumber,
				mapCoordinates: dto.mapCoordinates,

				roomsNumber: +dto.roomsNumber,
				bedsNumber: +dto.bedsNumber,
				bathroomsNumber: +dto.bathroomsNumber,
				floor: +dto.floor,
				area: +dto.area,
				minRentalPeriod: +dto.minRentalPeriod,

				authorId: +dto.authorId,
				categoryId: +dto.categoryId,
				favoritedBy: {}
			}
		})
	}

	async update(id: number, dto: PostDto, paths: string[]) {
		const {
			activity,
			name,
			images,
			description,
			price,
			utilitiesPrice,
			region,
			city,
			street,
			houseNumber,
			mapCoordinates,
			roomsNumber,
			bedsNumber,
			bathroomsNumber,
			floor,
			area,
			minRentalPeriod,
			categoryId,
			authorId
		} = dto
		const slug = slugify(dto.name, { lower: true })
		const uniqueSlug = `${slug}-${Date.now()}`
		return this.prismaService.post.update({
			where: {
				id
			},
			data: {
				activity: true,
				name,
				images: paths,
				description,
				price: +price,
				utilitiesPrice: +utilitiesPrice,
				region,
				city,
				street,
				houseNumber,
				mapCoordinates,
				roomsNumber: +roomsNumber,
				bedsNumber: +bedsNumber,
				bathroomsNumber: +bathroomsNumber,
				floor: +floor,
				area: +area,
				minRentalPeriod: +minRentalPeriod,
				slug: uniqueSlug,
				categoryId: +categoryId,
				authorId: +authorId
			}
		})
	}

	async delete(id: number) {
		return this.prismaService.post.delete({
			where: {
				id
			}
		})
	}
}
