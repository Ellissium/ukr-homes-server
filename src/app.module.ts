import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config/dist'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { PrismaService } from './prisma.service'
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { PostModule } from './post/post.module';
import { PaginationModule } from './pagination/pagination.module';

@Module({
	imports: [ConfigModule.forRoot(), AuthModule, UserModule, CategoryModule, PostModule, PaginationModule],
	controllers: [AppController],
	providers: [AppService, PrismaService]
})
export class AppModule {}
