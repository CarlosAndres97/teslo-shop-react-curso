import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const host = process.env.DB_HOST || '';
        const isNeon = host.includes('neon') || host.includes('neon.tech');
        const isSSL = process.env.DB_SSL === 'true' || process.env.STAGE === 'prod' || isNeon;
        return {
          type: 'postgres',
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          database: process.env.DB_NAME,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          autoLoadEntities: true,
          synchronize: true,
          ssl: isSSL ? { rejectUnauthorized: false } : false,
          extra: isSSL ? { ssl: { rejectUnauthorized: false } } : undefined,
        } as any;
      },
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'), 
    }),

    ProductsModule,

    CommonModule,

    SeedModule,

    FilesModule,

    AuthModule,

    MessagesWsModule,

  ],
})
export class AppModule {}
