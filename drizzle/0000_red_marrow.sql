CREATE TABLE "active_orders" (
	"id" text PRIMARY KEY NOT NULL,
	"supplier_name" text NOT NULL,
	"eta" text NOT NULL,
	"status" text NOT NULL,
	"route_map" text,
	"supplier_id" text,
	"item" text,
	"quantity" integer,
	"received_quantity" integer,
	"price" real,
	"date" text
);
--> statement-breakpoint
CREATE TABLE "activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dashboard_configs" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text DEFAULT 'default-org' NOT NULL,
	"config" jsonb NOT NULL,
	"updated_by" text NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ingredient_yields" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"ingredient_id" text NOT NULL,
	"raw_qty" numeric NOT NULL,
	"raw_unit" text NOT NULL,
	"cooked_qty" numeric NOT NULL,
	"cooked_unit" text NOT NULL,
	"notes" text,
	CONSTRAINT "ingredient_yields_org_ingredient_unique" UNIQUE("org_id","ingredient_id")
);
--> statement-breakpoint
CREATE TABLE "inventory_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"unit" text NOT NULL,
	"current_stock" numeric NOT NULL,
	"target_stock" numeric NOT NULL,
	"reorder_level" numeric NOT NULL,
	"expiry_date" date,
	"status" text NOT NULL,
	"supplier_id" integer
);
--> statement-breakpoint
CREATE TABLE "issues" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"item_name" text,
	"category" text,
	"type" text NOT NULL,
	"description" text NOT NULL,
	"photo_base64" text,
	"status" text DEFAULT 'Open',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "meal_headcounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"meal_session_id" text,
	"date" date NOT NULL,
	"meal_type" text NOT NULL,
	"served_count" integer NOT NULL,
	"logged_by" text NOT NULL,
	"logged_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "meal_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"date" date NOT NULL,
	"meal_type" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"planned_menu_item_ids" jsonb NOT NULL,
	"closed_at" timestamp,
	"closed_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "meal_sessions_org_date_meal_type_unique" UNIQUE("org_id","date","meal_type")
);
--> statement-breakpoint
CREATE TABLE "menu_change_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"meal_session_id" text NOT NULL,
	"original_menu_item_id" text NOT NULL,
	"substituted_menu_item_id" text,
	"reason" text,
	"changed_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menu_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"name" text NOT NULL,
	"meal_type" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"calories" integer NOT NULL,
	"image" text,
	"in_stock" boolean DEFAULT true,
	"day_of_week" text
);
--> statement-breakpoint
CREATE TABLE "menu_slots" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"weekly_menu_id" integer NOT NULL,
	"day_of_week" text NOT NULL,
	"meal_type" text NOT NULL,
	"menu_item_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "past_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoice_no" text NOT NULL,
	"supplier_name" text NOT NULL,
	"amount" numeric NOT NULL,
	"date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "prep_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"meal_session_id" text,
	"date" date NOT NULL,
	"meal_type" text NOT NULL,
	"menu_item_id" text NOT NULL,
	"actual_qty_cooked" numeric NOT NULL,
	"logged_by" text NOT NULL,
	"logged_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"menu_item_id" text NOT NULL,
	"ingredient_id" text NOT NULL,
	"qty_per_serving" numeric NOT NULL,
	"unit" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reuse_pool" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"source_meal_session_id" text NOT NULL,
	"menu_item_id" text NOT NULL,
	"qty" numeric NOT NULL,
	"unit" text NOT NULL,
	"status" text DEFAULT 'available' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"reused_in_meal_session_id" text,
	"written_off_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "rsvps" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"meal_session_id" text,
	"student_id" integer NOT NULL,
	"date" text NOT NULL,
	"meal_type" text NOT NULL,
	"attending" boolean DEFAULT false NOT NULL,
	"choice" text,
	"submitted_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "staples" (
	"id" serial PRIMARY KEY NOT NULL,
	"menu_item_id" text NOT NULL,
	"meal_type" text NOT NULL,
	"always_included" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"ingredient_id" text NOT NULL,
	"amount" numeric NOT NULL,
	"reason" text NOT NULL,
	"related_prep_log_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text,
	"email" text,
	"phone" text,
	"distance" text,
	"lead_time" text,
	"status_text" text,
	"items" jsonb,
	"attention_needed" text,
	"critical_message" text,
	"correspondence" jsonb
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" text NOT NULL,
	"name" text,
	"password_hash" text,
	"email" text NOT NULL,
	"role" text DEFAULT 'student' NOT NULL,
	"org_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "waste_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"meal_session_id" text,
	"source_type" text NOT NULL,
	"menu_item_id" text,
	"weight_kg" numeric NOT NULL,
	"logged_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weekly_menus" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"week_start_date" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ingredient_yields" ADD CONSTRAINT "ingredient_yields_ingredient_id_inventory_items_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."inventory_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_headcounts" ADD CONSTRAINT "meal_headcounts_meal_session_id_meal_sessions_id_fk" FOREIGN KEY ("meal_session_id") REFERENCES "public"."meal_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_change_logs" ADD CONSTRAINT "menu_change_logs_meal_session_id_meal_sessions_id_fk" FOREIGN KEY ("meal_session_id") REFERENCES "public"."meal_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_slots" ADD CONSTRAINT "menu_slots_weekly_menu_id_weekly_menus_id_fk" FOREIGN KEY ("weekly_menu_id") REFERENCES "public"."weekly_menus"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_slots" ADD CONSTRAINT "menu_slots_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_logs" ADD CONSTRAINT "prep_logs_meal_session_id_meal_sessions_id_fk" FOREIGN KEY ("meal_session_id") REFERENCES "public"."meal_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_logs" ADD CONSTRAINT "prep_logs_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_logs" ADD CONSTRAINT "prep_logs_logged_by_users_email_fk" FOREIGN KEY ("logged_by") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_ingredient_id_inventory_items_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."inventory_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reuse_pool" ADD CONSTRAINT "reuse_pool_source_meal_session_id_meal_sessions_id_fk" FOREIGN KEY ("source_meal_session_id") REFERENCES "public"."meal_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reuse_pool" ADD CONSTRAINT "reuse_pool_reused_in_meal_session_id_meal_sessions_id_fk" FOREIGN KEY ("reused_in_meal_session_id") REFERENCES "public"."meal_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_meal_session_id_meal_sessions_id_fk" FOREIGN KEY ("meal_session_id") REFERENCES "public"."meal_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staples" ADD CONSTRAINT "staples_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transactions" ADD CONSTRAINT "stock_transactions_related_prep_log_id_prep_logs_id_fk" FOREIGN KEY ("related_prep_log_id") REFERENCES "public"."prep_logs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waste_logs" ADD CONSTRAINT "waste_logs_meal_session_id_meal_sessions_id_fk" FOREIGN KEY ("meal_session_id") REFERENCES "public"."meal_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "inv_category_idx" ON "inventory_items" USING btree ("category");--> statement-breakpoint
CREATE INDEX "inv_status_idx" ON "inventory_items" USING btree ("status");--> statement-breakpoint
CREATE INDEX "inv_supplier_idx" ON "inventory_items" USING btree ("supplier_id");--> statement-breakpoint
CREATE INDEX "waste_created_at_idx" ON "waste_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "waste_source_type_idx" ON "waste_logs" USING btree ("source_type");