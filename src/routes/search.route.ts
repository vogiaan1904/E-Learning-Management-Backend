import { routesConfig } from "@/configs";
import searchController from "@/controllers/search.controller";
import { Router } from "express";

const router = Router();
const { searchRoute } = routesConfig;

router.get(searchRoute.search, searchController.search);

export const searchApis = router;
