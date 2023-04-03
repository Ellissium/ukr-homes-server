import { Prisma } from '@prisma/client'

export const userPostsObject: Prisma.PostSelect = {
	id: true,
	createdAt: true,
	updatedAt: true,

	activity: true,
	name: true,
	slug: true,
	images: true,
	description: true,
	price: true,
	utilitiesPrice: true,

	region: true,
	city: true,
	street: true,
	houseNumber: true,
	mapCoordinates: true,

	roomsNumber: true,
	bedsNumber: true,
	bathroomsNumber: true,
	floor: true,
	area: true,
	minRentalPeriod: true
}
