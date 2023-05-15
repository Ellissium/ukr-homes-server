import { faker } from '@faker-js/faker'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { generateSlug } from 'src/utils/generate-slug'
import { EnumPostSort, GetAllPostDto } from './dto/get-all.post.dto'
import { PostDto } from './dto/post.dto'
import { returnPostObject } from './return-post.object'

@Injectable()
export class PostService {
	constructor(
		private prismaService: PrismaService,
		private paginationService: PaginationService
	) {}

	async getAll(dto: GetAllPostDto = {}) {
		const { user, sort, searchTerm, category } = dto

		const prismaSort: Prisma.PostOrderByWithRelationInput[] = []

		switch (sort) {
			case EnumPostSort.LOW_PRICE:
				prismaSort.push({ price: 'asc' })
				break
			case EnumPostSort.HIGH_PRICE:
				prismaSort.push({ price: 'desc' })
				break
			case EnumPostSort.OLDEST:
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
				AND: [prismaSearchTermFilter, prismaCategoryFilter, prismaUserFilter]
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
					AND: [prismaSearchTermFilter, prismaCategoryFilter, prismaUserFilter]
				}
			})
		}
	}

	async byId(id: number) {
		const post = await this.prismaService.post.findUnique({
			where: {
				id
			},
			select: returnPostObject
		})

		if (!post) throw new NotFoundException('Post not found')

		return post
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

	async getSimilar(id: number) {
		const currentPost = await this.byId(id)

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

	async create() {
		const postName = faker.commerce.productName()
		return this.prismaService.post.create({
			data: {
				activity: true,
				name: postName,
				slug: faker.helpers.slugify(postName).toLowerCase(),
				images: Array.from({
					length: faker.datatype.number({ min: 1, max: 5 })
				}).map(() => faker.image.imageUrl()),
				description: faker.commerce.productDescription(),
				price: +faker.commerce.price(100, 99999, 0),
				utilitiesPrice: +faker.commerce.price(1, 999, 0),

				region: 'Kherson',
				city: 'Kherson',
				street: 'Khersonska',
				houseNumber: '1',
				mapCoordinates: 'some coordinates',

				roomsNumber: faker.datatype.number({ min: 1, max: 5 }),
				bedsNumber: faker.datatype.number({ min: 1, max: 10 }),
				bathroomsNumber: faker.datatype.number({ min: 1, max: 2 }),
				floor: faker.datatype.number({ min: 1, max: 50 }),
				area: faker.datatype.number({ min: 50, max: 100 }),
				minRentalPeriod: faker.datatype.number({ min: 1, max: 24 }),

				authorId: 1,
				categoryId: 1,
				favoritedBy: {}
			}
		})
	}

	async update(id: number, dto: PostDto) {
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
		return this.prismaService.post.update({
			where: {
				id
			},
			data: {
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
				slug: generateSlug(dto.name),
				category: {
					connect: {
						id: categoryId
					}
				},
				author: {
					connect: {
						id: authorId
					}
				}
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
