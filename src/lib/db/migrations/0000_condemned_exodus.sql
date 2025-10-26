CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(256) NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
