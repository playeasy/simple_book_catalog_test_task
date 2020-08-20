import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Author } from './entity/authors.entity';
import { AuthorInput } from './inputs/author.input';
import { Book } from 'src/books/entity/books.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorsRepository: Repository<Author>,
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async getAuthors(
    minNumberOfBooks: number,
    maxNumberOfBooks: number,
  ): Promise<Author[]> {
    let authors = await this.authorsRepository
      .createQueryBuilder('author')
      .leftJoinAndSelect('author.books', 'book')
      .loadRelationCountAndMap('author.booksCount', 'author.books')
      .getMany();

    if (!minNumberOfBooks && !maxNumberOfBooks) {
      return authors;
    }

    if (minNumberOfBooks && maxNumberOfBooks) {
      return authors.filter(
        author =>
          author['booksCount'] >= minNumberOfBooks &&
          author['booksCount'] <= maxNumberOfBooks,
      );
    }

    if (!minNumberOfBooks && maxNumberOfBooks) {
      return authors.filter(author => author['booksCount'] <= maxNumberOfBooks);
    }

    return authors.filter(author => author['booksCount'] >= minNumberOfBooks);
  }

  async getAuthorById(id: number): Promise<Author> {
    return this.authorsRepository
      .createQueryBuilder('author')
      .leftJoinAndSelect('author.books', 'book')
      .where({ id: id })
      .getOne();
  }

  async createAuthor(author: AuthorInput): Promise<Author> {
    author = this.authorsRepository.create(author);

    return await this.authorsRepository.save(author);
  }

  async deleteAuthor(id: number): Promise<number> {
    const deletedResult: DeleteResult = await this.authorsRepository.delete(id);

    return deletedResult.affected;
  }

  async deleteAuthorWithBooks(id: number): Promise<number> {
    const author: Author = await this.getAuthorById(id);
    if (!author) {
      return 0;
    }
    let totalItemsToDelete: number = 1; // Author already included

    const authorWithBooks: Book[] = await Promise.all(
      author.books.map(
        (book: Book): Promise<Book> => {
          return this.booksRepository
            .createQueryBuilder('books')
            .leftJoinAndSelect('books.authors', 'book')
            .where({ id: book.id })
            .getOne();
        },
      ),
    );

    const booksWithoutCoAuthors: Book[] = authorWithBooks.filter(
      (book: Book): boolean => {
        totalItemsToDelete += book.authors.length;

        return book.authors.length === 1;
      },
    );

    for (const book of booksWithoutCoAuthors) {
      await this.booksRepository.delete(book.id);
    }

    await this.authorsRepository.delete(author.id);

    return totalItemsToDelete;
  }
}
