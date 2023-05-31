import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	UploadedFiles,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { FileUpload } from './decorators/fileUpload.decorator'
import { GetAllPostDto } from './dto/get-all.post.dto'
import { PostService } from './post.service'
@Controller('post')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query() queryDto: GetAllPostDto) {
		return this.postService.getAll(queryDto)
	}

	@Get('similar/:id')
	async getSimilar(@CurrentUser('id') userId: number, @Param('id') id: string) {
		return this.postService.getSimilar(userId, +id)
	}

	@Get('by-slug/:slug')
	async getPostBySlug(@Param('slug') slug: string) {
		return this.postService.bySlug(slug)
	}

	@Get('by-category/:categorySlug')
	async getPostByCategory(@Param('categorySlug') categorySlug: string) {
		return this.postService.byCategory(categorySlug)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post()
	@FileUpload('images')
	// @UseInterceptors(
	// 	FilesInterceptor('images', 10, {
	// 		storage: diskStorage({
	// 			async destination(req, file, cb) {
	// 				const postPath = join(process.cwd(), `uploads`)
	// 				await ensureDir(postPath)
	// 				cb(null, postPath)
	// 			},
	// 			filename: (req, file, cb) => {
	// 				const filename = uuid()
	// 				const extension = file.mimetype.split('/')[1]
	// 				cb(null, `${filename}.${extension}`)
	// 			}
	// 		})
	// 	})
	// )
	async createPost(
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
						console.log(formData.avatarPath)
						console.log(filePath)
						return filePath
					})
				)

				console.log(filePaths)
			} else {
				console.log('Файли не були завантажені')
			}
			return this.postService.create(formData, filePaths)
		} catch (error) {
			console.error(error)
			throw new HttpException(
				'Помилка серверу',
				HttpStatus.INTERNAL_SERVER_ERROR
			)
		}
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put(':id')
	@FileUpload('images')
	async updatePost(
		@Param('id') id: string,
		@CurrentUser('id') userId: number,
		@Body() formData,
		@UploadedFiles() paths: Express.Multer.File[]
	) {
		console.log(id)
		const post = await this.postService.byId(userId, +formData.id)
		const currentFilePaths = post.images

		let filePaths = []
		if (paths) {
			filePaths = await Promise.all(
				paths.map(async file => {
					console.log(file.filename)
					const filePath =
						`http://localhost:4200/api/files/${file.filename}`.replace(
							/\\/g,
							'/'
						)
					return filePath
				})
			)
			// const removedFilePaths = currentFilePaths.filter(
			// 	filePath => !filePaths.includes(filePath)
			// )
			// await Promise.all(
			// 	removedFilePaths.map(async filePath => {
			// 		const filename = filePath.substring(filePath.lastIndexOf('/') + 1)
			// 		await unlink(join(process.cwd(), 'uploads', filename))
			// 	})
			// )
		}

		return this.postService.update(+formData.id, formData, filePaths)
	}

	@HttpCode(200)
	@Auth()
	@Delete(':id')
	async deletePost(@Param('id') id: string) {
		return this.postService.delete(+id)
	}

	@Get(':id')
	@Auth()
	async getPost(@CurrentUser('id') userId: number, @Param('id') id: string) {
		return this.postService.byId(userId, +id)
	}
}
