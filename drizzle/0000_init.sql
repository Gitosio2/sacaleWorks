CREATE TYPE "public"."model_phase" AS ENUM('not_started', 'pending_decal_design', 'pending_painting', 'pending_decals', 'pending_varnish', 'pending_assembly', 'finished');--> statement-breakpoint
CREATE TYPE "public"."quote_status" AS ENUM('open', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."relation_kind" AS ENUM('same', 'similar');--> statement-breakpoint
CREATE TYPE "public"."supply_status" AS ENUM('to_order', 'ordered', 'in_hand');--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"contact" text NOT NULL,
	"company" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consumables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"store" text,
	"description" text NOT NULL,
	"price_cents" integer,
	"reference" text,
	"status" "supply_status" DEFAULT 'to_order' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "model_consumables" (
	"model_id" uuid NOT NULL,
	"consumable_id" uuid NOT NULL,
	CONSTRAINT "model_consumables_model_id_consumable_id_pk" PRIMARY KEY("model_id","consumable_id")
);
--> statement-breakpoint
CREATE TABLE "models" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"client_id" uuid,
	"name" text NOT NULL,
	"price_cents" integer,
	"phase" "model_phase" DEFAULT 'not_started' NOT NULL,
	"requested_date" date,
	"estimated_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"model_id" uuid,
	"quote_id" uuid,
	"brand" text,
	"reference" text,
	"description" text NOT NULL,
	"price_cents" integer,
	"store" text,
	"url" text,
	"status" "supply_status" DEFAULT 'to_order' NOT NULL,
	CONSTRAINT "parts_one_owner" CHECK (("parts"."model_id" IS NOT NULL) <> ("parts"."quote_id" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "quote_related_models" (
	"quote_id" uuid NOT NULL,
	"model_id" uuid NOT NULL,
	"kind" "relation_kind" NOT NULL,
	"note" text,
	CONSTRAINT "quote_related_models_quote_id_model_id_pk" PRIMARY KEY("quote_id","model_id")
);
--> statement-breakpoint
CREATE TABLE "quotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"client_id" uuid,
	"title" text NOT NULL,
	"price_cents" integer,
	"status" "quote_status" DEFAULT 'open' NOT NULL,
	"converted_model_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "time_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"model_id" uuid NOT NULL,
	"worked_on" date NOT NULL,
	"hours" numeric(5, 2) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "model_consumables" ADD CONSTRAINT "model_consumables_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_consumables" ADD CONSTRAINT "model_consumables_consumable_id_consumables_id_fk" FOREIGN KEY ("consumable_id") REFERENCES "public"."consumables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "models" ADD CONSTRAINT "models_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parts" ADD CONSTRAINT "parts_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parts" ADD CONSTRAINT "parts_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_related_models" ADD CONSTRAINT "quote_related_models_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_related_models" ADD CONSTRAINT "quote_related_models_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_converted_model_id_models_id_fk" FOREIGN KEY ("converted_model_id") REFERENCES "public"."models"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "models_user_idx" ON "models" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "quotes_user_idx" ON "quotes" USING btree ("user_id");