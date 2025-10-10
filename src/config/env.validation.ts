import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().default(3000),
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
  DISABLE_REDIS: Joi.boolean().optional(),
  RATE_LIMIT_TTL: Joi.number().default(900),
  RATE_LIMIT_MAX: Joi.number().default(100),
  LOG_LEVEL: Joi.string().default('info'),
});
