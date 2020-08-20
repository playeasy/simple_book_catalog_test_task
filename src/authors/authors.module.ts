import { Module } from '@nestjs/common';
import { AuthorsResolver } from './authors.resolver';
import { AuthorsService } from './authors.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './entity/authors.entity';
import { Book } from 'src/books/entity/books.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Book])],
  exports: [TypeOrmModule, AuthorsService],
  providers: [AuthorsResolver, AuthorsService],
})
export class AuthorsModule {}
