import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DeleteResult } from 'typeorm';
import { Book } from './entity/books.entity';
import { BookInput } from './inputs/books.input';
import { Author } from 'src/authors/entity/authors.entity';
import { AuthorsService } from 'src/authors/authors.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    private authorsService: AuthorsService,
  ) {}

  async getBookById(id: number): Promise<Book> {
    return this.booksRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.authors', 'authors')
      .where({ id: id })
      .getOne();
  }

  async getBooksByTitle(title: string): Promise<Book[]> {
    let serachCondition: object = {};
    if (title) {
      serachCondition = { title: Like(title) };
    }
    return await this.booksRepository.find(serachCondition);
  }

  async deleteBook(id: number): Promise<number> {
    const deletedResult: DeleteResult = await this.booksRepository.delete(id);

    return deletedResult.affected;
  }

  async createBook(bookInput: BookInput): Promise<Book> {
    try {
      const authors: Author[] = await Promise.all(
        bookInput.authorIds.map(
          (authorId: number): Promise<Author> => {
            return this.authorsService.getAuthorById(authorId);
          },
        ),
      );

      const book: Book = new Book();
      book.title = bookInput.title;
      book.authors = authors;

      return await this.booksRepository.save(book);
    } catch {
      throw new Error('Authot id is invalid!');
    }
  }

  async addAuthor(bookId: number, authorId: number): Promise<Book> {
    const book: Book = await this.getBookById(bookId);

    if (!book) {
      throw new Error(`Book with id = ${bookId} not exist!`);
    }

    const author: Author = await this.authorsService.getAuthorById(authorId);

    if (!author) {
      throw new Error(`Author with id = ${authorId} not exist!`);
    }

    book.authors.push(author);

    return await this.booksRepository.save(book);
  }
}
