import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AccessTokenGuard } from './auth/guards/access-token.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({

  imports: [

    GraphQLModule.forRoot<ApolloDriverConfig>({

      driver: ApolloDriver,

      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),

    }),

    ConfigModule.forRoot({

      isGlobal: true,

      envFilePath: '.env'

    }),

    AuthModule,

    UsersModule

  ],

  providers: [

    PrismaService,

    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard
    }

  ],

})
export class AppModule { }
