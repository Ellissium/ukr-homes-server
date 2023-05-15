import { faker } from '@faker-js/faker'
import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt/dist'
import { User } from '@prisma/client'
import { hash, verify } from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { LoginDto, RegisterDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService
	) {}

	async login(dto: LoginDto) {
		const user = await this.validateUser(dto)
		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwtService.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException('invalid refresh token')

		const user = await this.prismaService.user.findUnique({
			where: {
				id: result.id
			}
		})

		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	async register(dto: RegisterDto) {
		const oldUser = await this.prismaService.user.findUnique({
			where: {
				email: dto.email
			}
		})

		if (oldUser) throw new BadRequestException('User already exists')

		const user = await this.prismaService.user.create({
			data: {
				email: dto.email,
				name: dto.name,
				avatarPath: faker.image.avatar(),
				phone: faker.phone.number('+38 ###-###-##-##'),
				password: await hash(dto.password)
			}
		})

		const tokens = await this.issueTokens(user.id)
		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	private async issueTokens(userId: number) {
		const data = { id: userId }

		const accessToken = this.jwtService.sign(data, {
			expiresIn: '1h'
		})
		const refreshToken = this.jwtService.sign(data, {
			expiresIn: '7d'
		})
		return { accessToken, refreshToken }
	}

	private returnUserFields(user: User) {
		return {
			id: user.id,
			email: user.email
		}
	}

	private async validateUser(dto: LoginDto) {
		const user = await this.prismaService.user.findUnique({
			where: {
				email: dto.email
			}
		})

		if (!user) throw new NotFoundException('user not found')

		const isValid = await verify(user.password, dto.password)
		if (!isValid) throw new UnauthorizedException('invalid password')

		return user
	}
}
