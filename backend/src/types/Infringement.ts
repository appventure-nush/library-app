import { Optional } from './common';

export interface InfringmentAttributes {
  id: number;
  userId: string;
  details: string;
}

export interface InfringementCreationAttributes extends Optional<InfringmentAttributes, 'id'> {}

// View Data

export interface InfringmentData {
  details: string;
  createdAt: Date;
}
