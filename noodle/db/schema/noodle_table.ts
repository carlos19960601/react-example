import { mysqlTableCreator } from 'drizzle-orm/mysql-core';

export const mysqlTable = mysqlTableCreator((name) => `noodle_${name}`)