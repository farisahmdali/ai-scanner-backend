import z from "zod";


export const CreateJobRoleSchema = z.object({
    name: z.string(),
    skills: z.array(z.string()).min(1, 'Skills must be at least 1'),
});

export const UpdateJobRoleSchema = z.object({
    name: z.string().optional(),
    skills: z.array(z.string()).min(1, 'Skills must be at least 1').optional(),
});

export type CreateJobRoleSchemaType = z.infer<typeof CreateJobRoleSchema>;
export type UpdateJobRoleSchemaType = z.infer<typeof UpdateJobRoleSchema>;