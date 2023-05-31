import { faker } from '@faker-js/faker'
import { Category, Post, PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

const createProducts = async (quantity: number) => {
	const posts: Post[] = []
	const categoryName = 'SALE'
	const category: Category = await prisma.category.create({
		data: {
			name: categoryName,
			slug: faker.helpers.slugify(categoryName).toLowerCase()
		}
	})
	for (let i = 0; i < quantity; i++) {
		const postName = faker.commerce.productName()

		const post = await prisma.post.create({
			data: {
				activity: true,
				name: postName,
				slug: faker.helpers.slugify(postName).toLowerCase(),
				images: Array.from({
					length: faker.datatype.number({ min: 1, max: 5 })
				}).map(() => faker.image.imageUrl()),
				description: faker.commerce.productDescription(),
				price: +faker.commerce.price(0, 0, 0),
				utilitiesPrice: +faker.commerce.price(0, 0, 0),

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
				categoryId: 2,
				favoritedBy: {}
			}
		})
		posts.push(post)
	}

	console.log(`Created ${posts.length} posts`)
}

async function main() {
	console.log('Start seeding ...')
	await createProducts(1)
}

main()
	.catch(e => console.error(e))
	.finally(async () => {
		await prisma.$disconnect()
	})
