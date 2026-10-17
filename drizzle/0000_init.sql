CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"status" text DEFAULT 'processing' NOT NULL,
	"error" text,
	"caption" text DEFAULT '' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"original_name" text NOT NULL,
	"original_file" text NOT NULL,
	"width" integer,
	"height" integer,
	"variants" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"city" text NOT NULL,
	"type" text NOT NULL,
	"service" text NOT NULL,
	"area" integer NOT NULL,
	"duration" text NOT NULL,
	"year" integer NOT NULL,
	"summary" text NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"theme" text DEFAULT 'light' NOT NULL,
	"align" text DEFAULT 'left' NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"cover_media_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'admin' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;