create table "public"."User Details" (
    "user_id" uuid not null,
    "created_at" timestamp with time zone default now(),
    "birth_date" date,
    "birth_time" time without time zone,
    "birth_location" json
);


alter table "public"."User Details" enable row level security;

CREATE UNIQUE INDEX "User Details_pkey" ON public."User Details" USING btree (user_id);

alter table "public"."User Details" add constraint "User Details_pkey" PRIMARY KEY using index "User Details_pkey";

alter table "public"."User Details" add constraint "User Details_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."User Details" validate constraint "User Details_user_id_fkey";


