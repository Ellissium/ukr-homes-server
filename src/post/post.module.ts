import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { PostController } from './post.controller'
import { PostService } from './post.service'

@Module({
	imports: [
		MulterModule.register({
			dest: './uploads'
		})
	],
	controllers: [PostController],
	providers: [PostService, PrismaService, PaginationService]
})
export class PostModule {}
