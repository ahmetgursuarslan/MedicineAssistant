"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typePostegreSqlOrmConfig = void 0;
//Entities import 
const typePostegreSqlOrmConfig = {
    type: "postgres",
    host: process.env.DB_PLSQL_NAME,
    port: Number(process.env.DB_PLSQL_PORT),
    username: process.env.DB_PLSQL_ROOT,
    password: process.env.DB_PLSQL_PASSWORD,
    database: process.env.DB_PLSQL_NAME,
    synchronize: Boolean(process.env.DB_PLSQL_SYNC),
    logging: Boolean(process.env.DB_PLSQL_LOGGING),
    //entities: []
};
exports.typePostegreSqlOrmConfig = typePostegreSqlOrmConfig;
