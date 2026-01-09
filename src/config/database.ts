import { Sequelize } from 'sequelize-typescript';
import { User } from '../model/User';
import dotenv from 'dotenv';
import { JobRoles } from '../model/JobRoles';
import { Applicants } from '../model/Applicants';
dotenv.config();

export const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  dialect: 'mysql',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  models: [User, JobRoles, Applicants],
  logging: false,
});
