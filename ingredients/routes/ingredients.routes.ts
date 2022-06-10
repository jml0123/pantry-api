import { getAllIngredients, getIngredientByID, validateDate, getAllExpiredIngredients, addNewIngredient, addNewIngredientsCollection, deleteIngredients, deleteSingleIngredient, getIngredientsByStorageId } from './../services/ingredients.service';
import { Router } from "express";
import { body, param, query } from 'express-validator';

const router = Router();

// Get all ingredients
router.get('/', getAllIngredients)

// Get all ingredient by ID 
router.get('/id', 
    query('value').isString(),
    getIngredientByID
)

// Delete ingredient by id
router.delete('/id',
    query('value').isString(),
    deleteSingleIngredient
)

// Get all ingredient by expiry date 
router.get('/expired', 
    query('date').isDate(),
    query('date').custom(validateDate),
    getAllExpiredIngredients
)

// Add ingredient 
router.post('/', 
    body('name').isString(),
    body('perishable').isBoolean(),
    body('quantity').isNumeric(),
    body('storage_id').isNumeric(),
    body('exp_date').isDate(),
    body('exp_date').custom(validateDate),
    body('product_string').isString().optional({ nullable: true }),
    addNewIngredient
)

// Add ingredients
router.post('/bulk',
    body('ingredients.*.name').isString(),
    body('ingredients.*.perishable').isBoolean(),
    body('ingredients.*.quantity').isNumeric(),
    body('ingredients.*.storage_id').isNumeric(),
    body('ingredients.*.exp_date').isDate(),
    body('ingredients.*.exp_date').custom(validateDate),
    body('ingredients.*.product_string').isString().optional({ nullable: true }),
    addNewIngredientsCollection
)

// Delete ingredients by list of ids
router.post('/bulk/remove',
    body('ingredients.*').isString(),
    deleteIngredients
)

// Get Ingredients by storage ID
router.get('/stored', 
    query('storage_id').isNumeric(),
    getIngredientsByStorageId
)

export default router;