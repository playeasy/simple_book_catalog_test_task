import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entity/books.entity';
import { BooksResolver } from './books.resolver';
import { BooksService } from './books.service';
import { AuthorsModule } from 'src/authors/authors.module';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), AuthorsModule],
  exports: [TypeOrmModule, BooksService],
  providers: [BooksResolver, BooksService],
})
export class BooksModule {}
