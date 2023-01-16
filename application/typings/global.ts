/* eslint-disable @typescript-eslint/no-namespace */
import { NonFunctionProperties } from '@libs/type';
import { TokenInjectedUserDto } from 'src/modules/user';

declare global {
  type Payload = TokenInjectedUserDto;
  type UUID = string;
  type AnyObject = Record<string, unknown>;
  type Plain<T> = T;
  type Optional<T> = T | undefined;
  type Nullable<T> = T | null;
  type OnlyProps<T> = NonFunctionProperties<T>;
  type Lazy<T> = Promise<T>;

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;

      PER_PAGE: string;
      PORT: string;
      JWT_ACCESS_SECRET: string;
      ROUND_SALT: string;

      PROD_DB_HOST: string;
      PROD_DB_PORT: string;
      PROD_DB_USER: string;
      PROD_DB_PASSWORD: string;
      PROD_DB_DATABASE: string;
      PROD_DB_TYPE: string;
      PROD_MAX_QUERY_EXECUTION_TIME: string;
      PROD_REDIS_HOST: string;
      PROD_REDIS_PORT: string;
      PROD_REDIS_TTL: string;
      PROD_REDIS_PASS: string;
      PROD_REDIS_DB: string;
      PROD_BATCH_ORIGIN: string;

      DEV_MAX_QUERY_EXECUTION_TIME: string;
      DEV_DB_TYPE: string;
      DEV_DB_HOST: string;
      DEV_DB_PORT: string;
      DEV_DB_USER: string;
      DEV_DB_PASSWORD: string;
      DEV_DB_DATABASE: string;
      DEV_REDIS_HOST: string;
      DEV_REDIS_PORT: string;
      DEV_REDIS_TTL: string;
      DEV_REDIS_PASS: string;
      DEV_REDIS_DB: string;
    }
  }

  namespace Express {
    interface Request {
      id: string;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends TokenInjectedUserDto {}
  }
}
