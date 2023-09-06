drop policy "Enable read for authenticated users based on user_id" on "public"."Astrological Details";

create policy "Enable read for authenticated users based on user_id"
on "public"."Astrological Details"
as permissive
for select
to authenticated
using (((auth.uid() = user_id) OR (user_id IS NULL)));



