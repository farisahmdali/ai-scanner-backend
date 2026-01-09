import { JobRoles } from "../model/JobRoles";
import { User } from "../model/User";
import {LoginUserSchemaType, RegisterUserSchemaType } from "../validationSchema/auth.schema";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CreateJobRoleSchemaType, UpdateJobRoleSchemaType } from "../validationSchema/jobroles.schema";
import { extractTextFromPDF } from "../config/pdf-text-extract";
import { extractSkillsFromText } from "../config/gemini";
import { Applicants } from "../model/Applicants";
import { Op } from "sequelize";
import fs from 'fs';
import path from "path";

export class UserController {
    async registerUser(data: RegisterUserSchemaType) {
       try {
            // Check if a user with the email already exists
            const existingUser = await User.findOne({ where: { email: data.email } });
            if (existingUser) {
                return {
                    created: false,
                    message: 'A user with this email already exists',
                };
            }
            const encryptedPassword = await bcrypt.hash(data.password, 10);
            const user = await User.create({
                name: data.name,
                email: data.email,
                password: encryptedPassword,
            });
            return {
                message: 'User registered successfully',
                user: user,
                created: true,
            };
       } catch (error) {
            throw error;
       }
    }

    async loginUser(data: LoginUserSchemaType) {
        try {
            const user = await User.findOne({ where: { email: data.email } });
            if (!user) {
                return {
                    message: 'User not found',
                    user: null,
                };
            }
            const isPasswordValid = await bcrypt.compare(data.password, user.password);
            if (!isPasswordValid) {
                return {
                    message: 'Invalid password',
                    user: null,
                    created: false,
                };
            }
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
            return {
                message: 'Login successful',
                user: user,
                token: token,
            };
        } catch (error) {
            throw error;
        }
    }

    async createJobRole(data: CreateJobRoleSchemaType, userId: number) {
        try {
            const jobRole = await JobRoles.create({
                name: data.name,
                skills: data.skills,
                userId: userId,
            });
            return {
                message: 'Job role created successfully',
                jobRole: jobRole,
            };
        }catch(error){
            throw error;
        }
    }

    async getJobRoles(userId: number) {
        try {
            const jobRoles = await JobRoles.findAll({ where: { userId: userId } });
            return {
                message: 'Job roles fetched successfully',
                jobRoles: jobRoles,
            };
        }catch(error){
            throw error;
        }
    }

    async deleteJobRole(userId: number, id: number) {
        try {
            const jobRole = await JobRoles.destroy({ where: { id: id, userId: userId } });
            if(!jobRole){
                return {
                    message: 'Job role not found',
                    jobRole: null,
                };
            }
            return {
                message: 'Job role deleted successfully',
                jobRole: jobRole,
            };
        }catch(error){
            throw error;
        }
    }

    async updateJobRole(userId: number, id: number, data: UpdateJobRoleSchemaType) {
        try {
            const jobRole = await JobRoles.update({ name: data.name, skills: data.skills }, { where: { id: id, userId: userId } });
            return {
                message: 'Job role updated successfully',
                jobRole: jobRole,
            };
        }catch(error){
            throw error;
        }
    }

    async uploadResume(userId: number, file: Express.Multer.File) {
        try {
            const filePath = file.path;
            const text = await extractTextFromPDF(filePath);
            const data = await extractSkillsFromText(text.text);
            const applicant = await Applicants.create({
                name:data.name,
                email:data.email,
                phone:data.phone,
                skills:data.skills,
                userId:userId,
                resume:file.filename
            })
            return {
                message: 'Resume uploaded successfully',
                applicant: applicant,
            };
        }catch(error){
            throw error;
        }
    }

    async getApplicants(userId: number, page: number, limit: number, search: string) {
        try {
            // Build where clause: userId must match AND (if search exists, match name OR email OR phone)
            const whereClause: any = { userId: userId };
            
            if (search && search.trim()) {
                whereClause[Op.or] = [
                    { name: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } },
                    { phone: { [Op.like]: `%${search}%` } }
                ];
            }
            
            const applicants = await Applicants.findAll({ 
                where: whereClause, 
                offset: (page - 1) * limit, 
                limit: limit, 
                order: [['createdAt', 'DESC']] 
            });
            
            const total = await Applicants.count({ where: whereClause });
            
            return {
                message: 'Applicants fetched successfully',
                applicants: applicants,
                total: total,
                page: page,
                limit: limit
            };
        }catch(error){
            throw error;
        }
    }

    async deleteApplicant(userId: number, id: number) {
        try {
            const applicant = await Applicants.findOne({ where: { id: id, userId: userId } });
            if(!applicant){
                return {
                    message: 'Applicant not found',
                    applicant: null,
                };
            }
            if(applicant.resume){
            const filePath = path.join(__dirname, '../../uploads', applicant.resume);
            fs.unlinkSync(filePath);
            }
            await Applicants.destroy({ where: { id: id, userId: userId } });
            return {
                message: 'Applicant deleted successfully',
                applicant: applicant,
            };
        }catch(error){
            throw error;
        }
    }
}

export default new UserController();