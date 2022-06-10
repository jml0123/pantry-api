export class ErrorDto {
    status!: number;
    log: any;

    constructor(log: any, status: number = 500) {
        this.log = log;
        this.status = status;
    }
}

export enum IngredientsColumns {
    DB_NAME = "ingredients",
    ID = "ingredient_id", 
    NAME = "name",
    PERISHABLE = "perishable", 
    EXP_DATE = "exp_date",
    QUANTITY = "quantity",
    DATE_ADDED = "date_added",
    STORAGE_ID = "storage_id",
    PRODUCT_STRING = "product_string"
}

export enum StorageUnitColumns {
    DB_NAME = "storage_containers",
    STORAGE_ID = "storage_id",
    NAME = "name"
}