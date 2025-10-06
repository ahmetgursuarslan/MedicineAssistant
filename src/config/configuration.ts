import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_SYNC: Joi.boolean().optional(),
  DB_LOGGING: Joi.boolean().optional(),
  JWT_SECRET: Joi.string().min(16).required(),
  JWT_EXPIRES_IN: Joi.string().default('900s'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  REDIS_URL: Joi.string().uri().required(),
  RATE_LIMIT_TTL: Joi.number().default(900),
  RATE_LIMIT_MAX: Joi.number().default(100),
});

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}
