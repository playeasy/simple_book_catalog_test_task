import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Book } from 'src/books/entity/books.entity';

@Entity({ name: 'authors' })
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  firstName: string;

  @Column('varchar', { length: 255 })
  lastName: string;

  @ManyToMany(
    type => Book,
    book => book.authors,
  )
  books: Book[];
}
