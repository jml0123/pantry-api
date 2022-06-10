import { Router } from "express";
import ingredients from '../../ingredients/routes/ingredients.routes';

const router = Router();

router.use('/ingredients', ingredients);

export default router;