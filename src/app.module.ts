import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DestinationsModule } from './destinations/destinations.module';
import { BucketListsModule } from './bucket-lists/bucket-lists.module';
import { BucketListItemsModule } from './bucket-list-items/bucket-list-items.module';
import typeorm from './config/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
      envFilePath: '.env.local'
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => 
        configService.get('typeorm') as TypeOrmModuleOptions,
    }),
    PostModule,
    AuthModule,
    UsersModule,
    DestinationsModule,
    BucketListsModule,
    BucketListItemsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
