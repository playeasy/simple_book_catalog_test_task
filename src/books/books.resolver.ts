import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Book } from './entity/books.entity';
import { BookInput } from './inputs/books.input';
import { BooksService } from './books.service';

@Resolver('Book')
@Resolver('Author')
export class BooksResolver {
  constructor(private booksService: BooksService) {}

  @Query(() => Book)
  async getBook(@Args('id') id: number): Promise<Book> {
    try {
      return this.booksService.getBookById(id);
    } catch (error) {
      console.log(error.massege);
      throw new Error(error.massege);
    }
  }

  @Query(() => Book)
  async getBooks(@Args('title') title: string): Promise<Book[]> {
    try {
      return this.booksService.getBooksByTitle(title);
    } catch (error) {
      console.log(error.massege);
      throw new Error(error.massege);
    }
  }

  @Mutation(() => Book)
  async createBook(@Args('book') bookInput: BookInput): Promise<Book> {
    return await this.booksService.createBook(bookInput);
  }

  @Mutation(() => Book)
  async addAuthor(
    @Args('bookId') bookId: number,
    @Args('authorId') authorId: number,
  ): Promise<Book> {
    return await this.booksService.addAuthor(bookId, authorId);
  }

  @Mutation(() => Book)
  async deleteBook(@Args('id') id: number): Promise<number> {
    try {
      return await this.booksService.deleteBook(id);
    } catch (error) {
      console.log(error.massege);
      throw new Error(error.massege);
    }
  }
}
