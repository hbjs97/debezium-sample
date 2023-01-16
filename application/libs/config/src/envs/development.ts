import { TypeORMCustomLogger } from '@libs/middleware';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const config = {
  db: {
    retryAttempts: 1,
    retryDelay: 1000,
    type: process.env.DEV_DB_TYPE,
    synchronize: false,
    logging: true,
    logger: new TypeORMCustomLogger(),
    namingStrategy: new SnakeNamingStrategy(),
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    username: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_DATABASE,
    maxQueryExecutionTime: process.env.DEV_MAX_QUERY_EXECUTION_TIME,
    extra: {
      connectionLimit: 30,
    },
    autoLoadEntities: true,
    entities: ['dist/**/*.entity.js'],
  },
};
