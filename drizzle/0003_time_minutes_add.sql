ALTER TABLE "time_entries" ADD COLUMN "minutes" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
UPDATE "time_entries" SET "minutes" = ROUND("hours" * 60)::int;
