CREATE TABLE `network_rooms` (
	`code` text PRIMARY KEY NOT NULL,
	`revision` integer NOT NULL,
	`payload` text NOT NULL,
	`expires_at` integer NOT NULL,
	`creator_bucket` text NOT NULL
);
