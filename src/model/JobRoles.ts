import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey } from "sequelize-typescript";
import { User } from "./User";

@Table({ tableName: 'job_roles', timestamps: true })
export class JobRoles extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;


    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    userId!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name!: string;


    @Column({
        type: DataType.JSON,
        allowNull: false,
        defaultValue: []
    })
    skills!: string[];
}