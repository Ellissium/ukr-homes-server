import { UseGuards } from '@nestjs/common/decorators'
import { AuthGuard } from '@nestjs/passport'

export const Auth = () => UseGuards(AuthGuard('jwt'))
