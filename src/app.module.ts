import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Photo } from './user/entities/photo.entity';
@Module({
  imports: [
  TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5454,
      username: 'admin',
      password: 'admin',
      database: 'testDBTwo',
      entities: [User,Photo],
      synchronize: true,
      logging: true,
      logger: "advanced-console",
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
