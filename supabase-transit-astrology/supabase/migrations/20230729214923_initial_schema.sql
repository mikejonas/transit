create policy "Enable insert for authenticated users only"
on "public"."User Details"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read for users based on user_id"
on "public"."User Details"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "Enable update for users based on user_id"
on "public"."User Details"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check (true);



