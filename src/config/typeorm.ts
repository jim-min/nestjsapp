import { registerAs } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";

const config = {
    type: 'postgres',
    host: `${process.env.DB_HOST || 'localhost'}`,
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME || 'test',
    password: process.env.DB_PASSWORD || 'test',
    database: process.env.DB_NAME || 'inflearn',
    entities: ['dist/**/**/*.entity.{js,ts}'],
    migrations: ['dist/migrations/*.{js,ts}'],
    autoLoadEntities: true,
    synchronize: false,
}

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions)