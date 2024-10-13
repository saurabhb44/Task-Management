import 'dotenv/config';

export const redisConfig = {
    url: `${process.env.MB_PROTOCOL}://${process.env.MB_HOST}:${process.env.MB_PORT}`
};
