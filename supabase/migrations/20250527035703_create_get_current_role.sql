-- Create or replace the get_current_role function
create or replace function public.get_current_role()
returns user_role
language sql stable
security definer
as $$
  select role
  from public.users
  where id = auth.uid();
$$;

-- Allow everyone to call it
grant execute on function public.get_current_role() to anon, authenticated; 