import { routesConfig } from "@/configs";
import * as ServiceController from "@/controllers/service.controller";
import { EmailServiceSchema } from "@/types/service";
import { servicesValidation } from "@/validations/services.validation";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router();
const { serviceRoutes } = routesConfig;

router.get(
  [serviceRoutes.status, serviceRoutes.default],
  (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({
      message: "Services APIs",
      status: "success",
    });
  },
);

router.post(
  serviceRoutes.emailService,
  servicesValidation(EmailServiceSchema),
  ServiceController.sendEmail,
);

export const serviceApis = router;
