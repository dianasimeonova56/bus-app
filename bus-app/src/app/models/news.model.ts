import { User } from './user.model';

export interface News {
  _id: string;
  title: string;
  content: string;
  category: 'Новини' | 'Промени' | 'Аварии' | 'Промоции';
  imageUrl?: string;
  author: Partial<User>;
  isImportant: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface CreateNewsDto {
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  isImportant: boolean;
}

export interface NewsResponse {
  docs: News[];
  meta: {
    totalDocs: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}