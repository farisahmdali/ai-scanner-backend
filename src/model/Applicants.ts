import { AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./User";



@Table({ tableName: 'applicants', timestamps: true })
export class Applicants extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    userId!: number;

    @Column(DataType.STRING)
    name!: string;

    @Column(DataType.STRING)
    email!: string;

    @Column(DataType.STRING)
    phone!: string;

    @Column({
        type: DataType.JSON,
        allowNull: false,
        defaultValue: []
    })
    skills!: string[];

    @Column(DataType.STRING)
    resume!: string;
}