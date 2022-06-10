import { IngredientsColumns, StorageUnitColumns } from './../../core/core.types';
import { validationResult } from "express-validator";
import { ErrorDto } from "../../core/core.dto";
const db = require('../../core/db');

export const validateDate = (param: string) => {
    console.log(param);
    const dateData = param.split('-');
    if (dateData.length !== 3 || dateData[0].length !== 4 || dateData[1].length !== 2 || dateData[2].length !== 2) throw new Error('Invalid date format. Must be YYYY-MM-DD');
    return true;
}

export const getAllIngredients = async(req: any, res: any, next: any) => {
    try {
        const {rows} = await db.query(`SELECT * FROM ${IngredientsColumns.DB_NAME} ORDER BY ${IngredientsColumns.NAME} ASC`);
        res.send(rows)
    } catch(e) {
        return next (new ErrorDto(e, 400));
    }
}

export const getIngredientByID = async(req: any, res: any, next: any) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return next(new ErrorDto(({errors: validationErrors.array() }), 500))
    }
    const {value} = req.query;
    try {
        const {rows} = await db.query(`SELECT * FROM ${IngredientsColumns.DB_NAME} WHERE ${IngredientsColumns.ID} = $1`, [value]);
        res.send(rows)
    } catch(e) {
        return next (new ErrorDto(e, 400));
    }
}

export const getAllExpiredIngredients = async(req: any, res: any, next: any) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return next(new ErrorDto(({errors: validationErrors.array() }), 500))
    }
    const {date} = req.query;
    try {
        const {rows} = await db.query(`SELECT * FROM ${IngredientsColumns.DB_NAME} WHERE ${IngredientsColumns.EXP_DATE} < $1`, [date]);
        res.send(rows);
    } catch(e) {
        return next (new ErrorDto(e, 400));
    }
}

export const addNewIngredient = async(req: any, res: any, next: any) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return next(new ErrorDto(({errors: validationErrors.array() }), 500))
    }

    const {name, perishable, exp_date, quantity, storage_id, product_string} = req.body;

    let dateAdded: Date | string = new Date()
    dateAdded = dateAdded.toISOString().split('T')[0];
    console.log(dateAdded);

    try {
        await db.query(`INSERT INTO ${IngredientsColumns.DB_NAME}(
            ${IngredientsColumns.NAME},
            ${IngredientsColumns.PERISHABLE},
            ${IngredientsColumns.EXP_DATE},
            ${IngredientsColumns.QUANTITY},
            ${IngredientsColumns.STORAGE_ID},
            ${IngredientsColumns.PRODUCT_STRING},
            ${IngredientsColumns.DATE_ADDED}
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
            name, perishable, exp_date, quantity, storage_id, product_string, dateAdded
        ]);
        res.redirect('/ingredients');
    } catch(e) {
        return next (new ErrorDto(e, 500));
    }
}
export const addNewIngredientsCollection = async(req: any, res: any, next: any) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return next(new ErrorDto(({errors: validationErrors.array() }), 500))
    }

    const {ingredients} = req.body;

    let dateAdded: Date | string = new Date()
    dateAdded = dateAdded.toISOString().split('T')[0];

    try {
        for (let ing of ingredients) {
            await db.query(`INSERT INTO ${IngredientsColumns.DB_NAME}(
                ${IngredientsColumns.NAME},
                ${IngredientsColumns.PERISHABLE},
                ${IngredientsColumns.EXP_DATE},
                ${IngredientsColumns.QUANTITY},
                ${IngredientsColumns.STORAGE_ID},
                ${IngredientsColumns.PRODUCT_STRING},
                ${IngredientsColumns.DATE_ADDED}
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
                    ing.name, ing.perishable, ing.exp_date, ing.quantity, ing.storage_id, ing.product_string, dateAdded
            ]);
        }
        res.redirect('/ingredients');
    } catch(e) {
        return next (new ErrorDto(e, 500));
    }
}
export const deleteSingleIngredient = async(req: any, res: any, next: any) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return next(new ErrorDto(({errors: validationErrors.array() }), 500))
    }

    const {value} = req.query;

    try {
        await db.query(`DELETE FROM ${IngredientsColumns.DB_NAME} WHERE ${IngredientsColumns.ID} = $1`, [value]);
        res.redirect('/ingredients');
    } catch(e) {
        return next (new ErrorDto(e, 500));
    }
}
export const deleteIngredients = async(req: any, res: any, next: any) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return next(new ErrorDto(({errors: validationErrors.array() }), 500))
    }

    const {ingredients} = req.body;

    try {
        for (let id of ingredients) {
            await db.query(`DELETE FROM ${IngredientsColumns.DB_NAME} WHERE ${IngredientsColumns.ID} = $1`, [id]);
        }
        res.redirect('/ingredients');
    } catch(e) {
        return next (new ErrorDto(e, 500));
    }
}

export const getIngredientsByStorageId = async(req: any, res: any, next: any) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return next(new ErrorDto(({errors: validationErrors.array() }), 500))
    }

    const {storage_id} = req.query;
    console.log(storage_id);

    try {
        const {rows } = await db.query(
            `SELECT 
                ${IngredientsColumns.DB_NAME}.${IngredientsColumns.NAME}, 
                ${IngredientsColumns.DB_NAME}.${IngredientsColumns.STORAGE_ID},
                ${IngredientsColumns.DB_NAME}.${IngredientsColumns.EXP_DATE}
            FROM 
                ${IngredientsColumns.DB_NAME} 
            JOIN 
                ${StorageUnitColumns.DB_NAME} 
            ON 
                ${StorageUnitColumns.DB_NAME}.${StorageUnitColumns.STORAGE_ID} = ${IngredientsColumns.DB_NAME}.${IngredientsColumns.STORAGE_ID}
            WHERE 
                ${StorageUnitColumns.DB_NAME}.${StorageUnitColumns.STORAGE_ID} = $1
            ORDER BY
                ${IngredientsColumns.DB_NAME}.${IngredientsColumns.EXP_DATE} ASC
        `, [storage_id]);
        res.send(rows);
    } catch(e) {
        return next (new ErrorDto(e, 500));
    }
}

module.exports = {
    getAllIngredients,
    getIngredientByID,
    getAllExpiredIngredients,
    validateDate,
    addNewIngredient,
    addNewIngredientsCollection,
    deleteIngredients,
    deleteSingleIngredient,
    getIngredientsByStorageId
}
