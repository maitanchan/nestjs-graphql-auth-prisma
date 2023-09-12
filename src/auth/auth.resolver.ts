import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { SignResponse } from './dto/sign-response';
import { LogoutResponse } from './dto/logout-respone';
import { Public } from './decorators/public.decorator';
import { NewTokenResponse } from './dto/newToken-response';
import { CurrentUserId } from './decorators/curent-userId.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Resolver()
export class AuthResolver {

  constructor(private readonly authService: AuthService) { }

  @Public()
  @Mutation(() => SignResponse)
  register(@Args('registerInput') registerInput: RegisterInput) {

    return this.authService.register(registerInput)

  }

  @Public()
  @Mutation(() => SignResponse)
  login(@Args('loginInput') loginInput: LoginInput) {

    return this.authService.login(loginInput)

  }

  @Public()
  @Mutation(() => LogoutResponse)
  logout(@Args('id', { type: () => Int }) id: number) {

    return this.authService.logout(id)

  }

  @Query(() => String)
  hello() {
    return 'Hello, world!';
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => NewTokenResponse)
  getNewToken(@CurrentUserId() userId: number, @CurrentUser('refreshToken') refreshToken: string) {

    return this.authService.getNewToken(userId, refreshToken)

  }


}
