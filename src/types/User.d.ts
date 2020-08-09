export interface User {
  name: String;
  email: String;
}

export enum Role {
  ADMIN = 1,
  LIBRARIAN = 2,
  STAFF = 11,
  STUDENT = 21,
}
