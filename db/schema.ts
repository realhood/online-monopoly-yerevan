import {sqliteTable,text,integer,primaryKey,index} from 'drizzle-orm/sqlite-core';
export const networkRooms=sqliteTable('network_rooms',{code:text('code').primaryKey(),revision:integer('revision').notNull(),payload:text('payload').notNull(),expiresAt:integer('expires_at').notNull(),creatorBucket:text('creator_bucket').notNull()});

export const networkMessages=sqliteTable('network_messages',{
 roomCode:text('room_code').notNull().references(()=>networkRooms.code,{onDelete:'cascade'}),id:text('id').notNull(),seat:integer('seat').notNull(),text:text('text').notNull(),createdAt:integer('created_at').notNull()
},t=>[primaryKey({columns:[t.roomCode,t.id]}),index('messages_room_time').on(t.roomCode,t.createdAt)]);
export const networkVoiceMembers=sqliteTable('network_voice_members',{
 roomCode:text('room_code').notNull().references(()=>networkRooms.code,{onDelete:'cascade'}),seat:integer('seat').notNull(),session:text('session').notNull(),muted:integer('muted').notNull(),expiresAt:integer('expires_at').notNull()
},t=>[primaryKey({columns:[t.roomCode,t.seat]})]);
export const networkVoiceSignals=sqliteTable('network_voice_signals',{
 id:integer('id').primaryKey({autoIncrement:true}),roomCode:text('room_code').notNull().references(()=>networkRooms.code,{onDelete:'cascade'}),sender:integer('sender').notNull(),senderSession:text('sender_session').notNull(),recipient:integer('recipient').notNull(),recipientSession:text('recipient_session').notNull(),payload:text('payload').notNull(),expiresAt:integer('expires_at').notNull()
},t=>[index('signals_room_recipient').on(t.roomCode,t.recipient,t.id)]);
