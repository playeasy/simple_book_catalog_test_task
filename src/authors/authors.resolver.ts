import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { AuthorsService } from './authors.service';
import { Author } from './entity/authors.entity';
import { AuthorInput } from './inputs/author.input';

@Resolver('Author')
export class AuthorsResolver {
  constructor(private authorsService: AuthorsService) {}

  @Query(() => Author)
  async getAuthor(@Args('id') id: number): Promise<Author> {
    return this.authorsService.getAuthorById(id);
  }

  @Query(() => [Author])
  async getAuthors(
    @Args('minNumberOfBooks') minNumberOfBooks: number,
    @Args('maxNumberOfBooks') maxNumberOfBooks: number,
  ): Promise<Author[]> {
    try {
      return this.authorsService.getAuthors(minNumberOfBooks, maxNumberOfBooks);
    } catch (error) {
      console.log(error.massege);
      throw new Error(error.massege);
    }
  }

  @Mutation(() => Author)
  async createAuthor(@Args('author') author: AuthorInput): Promise<Author> {
    try {
      return this.authorsService.createAuthor(author);
    } catch (error) {
      console.log(error.massege);
      throw new Error(error.massege);
    }
  }

  @Mutation(() => Author)
  async deleteAuthor(@Args('id') id: number): Promise<number> {
    return this.authorsService.deleteAuthor(id);
  }

  @Mutation(() => Author)
  async deleteAuthorWithBooks(@Args('id') id: number): Promise<number> {
    return this.authorsService.deleteAuthorWithBooks(id);
  }
}
