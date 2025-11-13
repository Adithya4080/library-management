import { Library } from '../models/Library';
import { User } from '../models/User';
import { Book } from '../models/Book';
import { LibraryService } from '../services/LibraryService';

// Singleton instance for in-memory storage
let libraryServiceInstance: LibraryService | null = null;

export function getLibraryService(): LibraryService {
  if (!libraryServiceInstance) {
    // Initialize library
    const library = new Library();

    // Add initial books
    library.addBook(new Book('978-0132350884', 'Clean Code', 'Robert C. Martin', 3));
    library.addBook(new Book('978-0201633610', 'Design Patterns', 'Gang of Four', 2));
    library.addBook(new Book('978-0134685991', 'Effective Java', 'Joshua Bloch', 2));
    library.addBook(new Book('978-0596007126', 'The Pragmatic Programmer', 'Hunt & Thomas', 2));
    library.addBook(new Book('978-0137081073', 'The Clean Coder', 'Robert C. Martin', 1));
    library.addBook(new Book('978-0321125215', 'Domain-Driven Design', 'Eric Evans', 2));
    library.addBook(new Book('978-0321721334', 'Refactoring', 'Martin Fowler', 3));
    library.addBook(new Book('978-0135957059', 'The Mythical Man-Month', 'Frederick Brooks', 1));

    // Initialize service
    libraryServiceInstance = new LibraryService(library);

    // Add initial users
    const user1 = new User('user1', 'Alice Johnson', 'alice@example.com');
    const user2 = new User('user2', 'Bob Smith', 'bob@example.com');
    const user3 = new User('user3', 'Charlie Davis', 'charlie@example.com');

    libraryServiceInstance.registerUser(user1);
    libraryServiceInstance.registerUser(user2);
    libraryServiceInstance.registerUser(user3);
  }

  return libraryServiceInstance;
}

export function resetLibraryService(): void {
  libraryServiceInstance = null;
}