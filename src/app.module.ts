import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config/dist'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'
import { PaginationModule } from './pagination/pagination.module'
import { PostModule } from './post/post.module'
import { PrismaService } from './prisma.service'
import { UserModule } from './user/user.module'
@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		CategoryModule,
		PostModule,
		PaginationModule,
		ServeStaticModule.forRoot({
			rootPath: join(process.cwd(), 'uploads'),
			serveRoot: '/api/files'
		})
	],
	controllers: [AppController],
	providers: [AppService, PrismaService]
})
export class AppModule {}
