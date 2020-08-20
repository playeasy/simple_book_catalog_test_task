import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Author } from 'src/authors/entity/authors.entity';

@Entity({ name: 'books' })
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  title: string;

  @ManyToMany(
    type => Author,
    author => author.books,
  )
  @JoinTable()
  authors: Author[];
}
