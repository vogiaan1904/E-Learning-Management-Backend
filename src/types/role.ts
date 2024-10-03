import { Role } from "@prisma/client";

export const unallowedRoles: Role[] = [Role.teacher, Role.user];
