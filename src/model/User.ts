import {
    Table, Column, Model, DataType, PrimaryKey, AutoIncrement,
    Unique
} from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    
    @Column(DataType.STRING)
    name!: string;

    @Column(DataType.STRING)
    email!: string;

    @Column(DataType.STRING)
    password!: string;
}