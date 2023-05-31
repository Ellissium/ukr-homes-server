import { UseInterceptors } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { ensureDir } from 'fs-extra'
import { diskStorage } from 'multer'
import { join } from 'path'
import { v4 as uuid } from 'uuid'

export const FileUpload = (name: string) =>
	UseInterceptors(
		FilesInterceptor(name, 10, {
			storage: diskStorage({
				async destination(req, file, cb) {
					const postPath = join(process.cwd(), `uploads`)
					await ensureDir(postPath)
					cb(null, postPath)
				},
				filename: (req, file, cb) => {
					const filename = uuid()
					// const extension = file.mimetype.split('/')[1]
					const extension = file.originalname.split('.').pop()
					console.log(filename + '.' + extension)
					cb(null, `${filename}.${extension}`)
				}
			})
		})
	)
