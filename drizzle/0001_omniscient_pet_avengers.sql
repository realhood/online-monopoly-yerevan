CREATE TABLE `network_messages` (
	`room_code` text NOT NULL,
	`id` text NOT NULL,
	`seat` integer NOT NULL,
	`text` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`room_code`, `id`),
	FOREIGN KEY (`room_code`) REFERENCES `network_rooms`(`code`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `messages_room_time` ON `network_messages` (`room_code`,`created_at`);--> statement-breakpoint
CREATE TABLE `network_voice_members` (
	`room_code` text NOT NULL,
	`seat` integer NOT NULL,
	`session` text NOT NULL,
	`muted` integer NOT NULL,
	`expires_at` integer NOT NULL,
	PRIMARY KEY(`room_code`, `seat`),
	FOREIGN KEY (`room_code`) REFERENCES `network_rooms`(`code`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `network_voice_signals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_code` text NOT NULL,
	`sender` integer NOT NULL,
	`sender_session` text NOT NULL,
	`recipient` integer NOT NULL,
	`recipient_session` text NOT NULL,
	`payload` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`room_code`) REFERENCES `network_rooms`(`code`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `signals_room_recipient` ON `network_voice_signals` (`room_code`,`recipient`,`id`);