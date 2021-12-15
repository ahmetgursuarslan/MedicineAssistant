import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

//Entities import 

const typePostegreSqlOrmConfig: PostgresConnectionOptions = {
    type: "postgres",
    host: process.env.DB_PLSQL_NAME,
    port: Number( process.env.DB_PLSQL_PORT),
    username: process.env.DB_PLSQL_ROOT,
    password: process.env.DB_PLSQL_PASSWORD,
    database: process.env.DB_PLSQL_NAME,
    synchronize: Boolean(process.env.DB_PLSQL_SYNC),
    logging: Boolean(process.env.DB_PLSQL_LOGGING),
    //entities: []
};

export { typePostegreSqlOrmConfig };