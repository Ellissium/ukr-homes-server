import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	Patch,
	Put,
	UploadedFiles,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { FileUpload } from 'src/post/decorators/fileUpload.decorator'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@CurrentUser('id') id: number) {
		return this.userService.byId(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put('profile')
	@FileUpload('avatarPath')
	async updateProfile(
		@CurrentUser('id') id: number,
		@Body() formData,
		@UploadedFiles() paths: Express.Multer.File[]
	) {
		try {
			let filePaths = []
			if (paths) {
				filePaths = await Promise.all(
					paths.map(async file => {
						const filePath =
							`http://localhost:4200/api/files/${file.filename}`.replace(
								/\\/g,
								'/'
							)
						console.log(filePath)
						return filePath
					})
				)

				console.log(filePaths)
			} else {
				console.log('Файли не були завантажені')
			}
			return this.userService.updateProfile(id, formData, filePaths)
		} catch (error) {
			console.error(error)
			throw new HttpException(
				'Помилка серверу',
				HttpStatus.INTERNAL_SERVER_ERROR
			)
		}
	}

	@HttpCode(200)
	@Auth()
	@Patch('profile/favorites/:productId')
	async toggleFavorite(
		@CurrentUser('id') id: number,
		@Param('productId') productId: string
	) {
		return this.userService.toggleFavorite(id, +productId)
	}
}
