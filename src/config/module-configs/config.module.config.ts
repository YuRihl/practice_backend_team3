import type { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

const configModuleConfig: ConfigModule = {
  envFilePath: 'src/config/.env',
  isGlobal: true,
  validationSchema: Joi.object({
    PORT: Joi.number().default(3000),
    DB_TYPE: Joi.valid(
      'mysql',
      'postgres',
      'cockroachdb',
      'mariadb',
      'sqlite',
      'mssql',
      'mongodb',
    ).default('postgres'),
    DB_VERSION: Joi.valid(Joi.number(), 'latest').default('latest'),
    DB_HOST: Joi.string().default('localhost'),
    DB_PORT: Joi.number().default(5432),
    DB_NAME: Joi.string(),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    PGADMIN_EMAIL: Joi.string().email(),
    PGADMIN_PASSWORD: Joi.string(),
    PGADMIN_PORT: Joi.number().default(5050),
  }),
};

export { configModuleConfig };
