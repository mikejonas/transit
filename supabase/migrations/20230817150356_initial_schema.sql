drop policy "Enable insert for authenticated users only" on "public"."Astrological Details ";

drop policy "Enable read for authenticated users based on user_id" on "public"."Astrological Details ";

drop policy "Enable update for users based on user_id" on "public"."Astrological Details ";

alter table "public"."Astrological Details " drop constraint "Astrological Details _user_id_fkey";

alter table "public"."Astrological Details " drop constraint "Astrological Details _pkey";

drop index if exists "public"."Astrological Details _pkey";

drop table "public"."Astrological Details ";

create table "public"."Astrological Details" (
    "astrological_details_id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone default now(),
    "user_id" uuid,
    "sign_name" text not null,
    "sign" text not null,
    "hours" smallint not null,
    "minutes" smallint not null
);


alter table "public"."Astrological Details" enable row level security;

CREATE UNIQUE INDEX "Astrological Details _pkey" ON public."Astrological Details" USING btree (astrological_details_id);

alter table "public"."Astrological Details" add constraint "Astrological Details _pkey" PRIMARY KEY using index "Astrological Details _pkey";

alter table "public"."Astrological Details" add constraint "Astrological Details_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."Astrological Details" validate constraint "Astrological Details_user_id_fkey";

create policy "Enable insert for authenticated users only"
on "public"."Astrological Details"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read for authenticated users based on user_id"
on "public"."Astrological Details"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "Enable update for users based on user_id"
on "public"."Astrological Details"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check (true);



