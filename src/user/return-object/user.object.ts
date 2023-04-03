import { Prisma } from '@prisma/client'

export const userObject: Prisma.UserSelect = {
	id: true,
	email: true,
	name: true,
	avatarPath: true,
	password: false,
	phone: true,
	role: true
}
