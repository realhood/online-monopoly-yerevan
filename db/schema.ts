import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const networkRooms=sqliteTable('network_rooms',{code:text('code').primaryKey(),revision:integer('revision').notNull(),payload:text('payload').notNull(),expiresAt:integer('expires_at').notNull(),creatorBucket:text('creator_bucket').notNull()});
