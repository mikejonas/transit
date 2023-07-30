drop policy "Enable read for users based on user_id" on "public"."User Details";

alter table "public"."Conversations" alter column "user_id" set data type uuid using "user_id"::uuid;

alter table "public"."Messages" add column "user_id" uuid;

create policy "Enable insert for authenticated users only"
on "public"."Conversations"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read for authenticated users based on user_id"
on "public"."Conversations"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "Enable insert for authenticated users only"
on "public"."Messages"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read for authenticated users based on user_id"
on "public"."Messages"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "Enable read for authenticated users based on user_id"
on "public"."User Details"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));



