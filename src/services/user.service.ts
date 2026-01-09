import { NextFunction, Request, Response } from "express";
import userController from "../controller/user.controller";
import { CustomRequest } from "../config/types";
import { UpdateJobRoleSchemaType } from "../validationSchema/jobroles.schema";
import path from "path";


export class UserService {
    async registerUser(req: Request, res: Response, next: NextFunction) {
        try{
            const result = await userController.registerUser(req.body);
            if(result.created){
                return res.status(201).json(result);
            }else{
                return res.status(400).json(result);
            }
        }catch(error){
            next(error);
        }
    }

    async loginUser(req: Request, res: Response, next: NextFunction) {
        try{
            const result = await userController.loginUser(req.body);
            return res.status(200).json(result);
        }catch(error){
            next(error);
        }
    }

    async createJobRole(req: CustomRequest, res: Response, next: NextFunction) {
        try{
            const result = await userController.createJobRole(req.body, req.user?.id as number);
            return res.status(201).json(result);
        }catch(error){
            next(error);
        }
    }

    async getJobRoles(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const result = await userController.getJobRoles(req.user?.id as number);
            return res.status(200).json(result);
        }catch(error){
            next(error);
        }
    }

    async deleteJobRole(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const result = await userController.deleteJobRole(req.user?.id as number, parseInt(req.params.id));
            return res.status(200).json(result);
        }catch(error){
            next(error);
        }
    }

    async updateJobRole(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const result = await userController.updateJobRole(req.user?.id as number, parseInt(req.params.id), req.body as UpdateJobRoleSchemaType);
            return res.status(200).json(result);
        }catch(error){
            next(error);
        }
    }

    async uploadResume(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const result = await userController.uploadResume(req.user?.id as number, req.file as Express.Multer.File);
            return res.status(200).json(result);
        }catch(error){
            next(error);
        }
    }

    async getApplicants(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string || '';
            const result = await userController.getApplicants(req.user?.id as number, page, limit, search);
            return res.status(200).json(result);
        }catch(error){
            next(error);
        }
    }

    async getUploadedFile(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const filename = req.params.filename;
            const filePath = path.join(__dirname, '../../uploads', filename);
            res.sendFile(filePath);
        }catch(error){
            next(error);
        }
    }
    async deleteApplicant(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const result = await userController.deleteApplicant(req.user?.id as number, parseInt(req.params.id));
            return res.status(200).json(result);
        }catch(error){
            next(error);
        }
    }
}

export default new UserService();