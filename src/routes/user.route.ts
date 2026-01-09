import express from 'express';
import userService from '../services/user.service';
import { LoginUserSchema, RegisterUserSchema } from '../validationSchema/auth.schema';
import { validationPipe } from '../middlewares/validationPipe';
import { CreateJobRoleSchema } from '../validationSchema/jobroles.schema';
import { verifyToken } from '../middlewares/authentication';
import multer from "multer";
import path from 'path';
import fs from 'fs';

const router = express.Router();

const uploadsDir = 'uploads/';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const filename = `${nameWithoutExt}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  }
});

const fileFilter = (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['application/pdf'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

router.post('/register', validationPipe(RegisterUserSchema), userService.registerUser);
router.post('/login', validationPipe(LoginUserSchema), userService.loginUser);
router.post('/job-roles', verifyToken, validationPipe(CreateJobRoleSchema), userService.createJobRole);
router.get('/job-roles', verifyToken, userService.getJobRoles);
router.delete('/job-roles/:id', verifyToken, userService.deleteJobRole);
router.patch('/job-roles/:id', verifyToken, validationPipe(CreateJobRoleSchema), userService.updateJobRole);

router.post("/upload-resume", verifyToken, upload.single('resume'), userService.uploadResume);
router.get('/applicants', verifyToken, userService.getApplicants);
router.get('/uploads/:filename', verifyToken, userService.getUploadedFile);
router.delete('/applicants/:id', verifyToken, userService.deleteApplicant);

export default router;