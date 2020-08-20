import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './authors/entity/authors.entity';
import { Book } from './books/entity/books.entity';

@Module({
  imports: [
    AuthorsModule,
    BooksModule,
    GraphQLModule.forRoot({ typePaths: ['./**/*.graphql'], path: '' }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql',
      port: 3306,
      username: 'root',
      password: 'root',
      logging: true,
      database: 'books_catalogue',
      entities: [Author, Book],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
