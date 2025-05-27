-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ENUM types
create type user_role as enum ('ADMIN','SE','CLIENT');
create type exception_severity as enum ('CRITICAL','HIGH','MEDIUM','LOW');
create type exception_type as enum (
'AUTHENTICATION',
'DATA_PROCESS',
'INTEGRATION',
'WORKFLOW_LOGIC',
'BROWSER_AUTOMATION'
);
create type billing_cadence as enum ('MONTHLY','QUARTERLY','YEARLY');
create type contract_length as enum ('MONTH','QUARTER','YEAR');
create type pricing_model as enum ('CONSUMPTION','SUBSCRIPTION');

-- Helper function to read custom role from JWT
create or replace function public.current_app_role()
returns user_role
language sql stable
as $$
  select (auth.jwt() ->> 'role')::user_role;
$$;

-- Core tables 
create table public.users ( id uuid primary key default uuid_generate_v4(), role user_role not null, full_name text, email text unique not null, phone text, hourly_rate_cost numeric, hourly_rate_billable numeric, created_at timestamptz default now() ); create table public.clients ( id uuid primary key default uuid_generate_v4(), name text not null, url text, contract_start_date date, contract_end_date date, plan_id uuid, created_at timestamptz default now() ); create table public.departments ( id uuid primary key default uuid_generate_v4(), client_id uuid references public.clients(id) on delete cascade, name text not null ); create table public.se_assignments ( se_id uuid references public.users(id) on delete cascade, client_id uuid references public.clients(id) on delete cascade, primary key (se_id, client_id) ); create table public.client_users ( user_id uuid references public.users(id) on delete cascade, client_id uuid references public.clients(id) on delete cascade, department_id uuid references public.departments(id), is_billing boolean default false, is_admin boolean default false, primary key (user_id, client_id) ); 

-- On-boarding pipeline 
create table public.stages ( id serial primary key, name text, sort_order int ); insert into public.stages (name, sort_order) values ('Discovery: Initial Survey',1), ('Discovery: Process deep dive',2), ('ADA Proposal Sent',3), ('ADA Proposal Review done',4), ('ADA Contract Sent',5), ('ADA Contract Signed',6), ('Credentials collected',7), ('Factory build initiated',8), ('Test plan generated',9), ('Testing started',10), ('Production deploy',11); create table public.client_stage_progress ( id uuid primary key default uuid_generate_v4(), client_id uuid references public.clients(id) on delete cascade, stage_id int references public.stages(id), completed_at timestamptz ); 

-- Plans & billing 
create table public.plans ( id uuid primary key default uuid_generate_v4(), name text, pricing_model pricing_model, description text, contract_length contract_length, billing_cadence billing_cadence, setup_fee numeric, prepayment_percent numeric, cap_amount numeric, overage_cost numeric, credits_per_period int, price_per_credit numeric ); alter table public.clients add constraint fk_plan foreign key (plan_id) references public.plans(id); create table public.invoices ( id uuid primary key default uuid_generate_v4(), client_id uuid references public.clients(id) on delete cascade, plan_snapshot jsonb, invoice_date date, due_date date, amount numeric, pdf_url text, status text ); 

-- Workflows 
create table public.workflows ( id uuid primary key default uuid_generate_v4(), client_id uuid references public.clients(id) on delete cascade, department_id uuid references public.departments(id), name text not null, description text, active boolean default true, time_saved_per_exec numeric, money_saved_per_exec numeric, created_at timestamptz default now() ); create table public.nodes ( id uuid primary key default uuid_generate_v4(), workflow_id uuid references public.workflows(id) on delete cascade, name text, type text ); create table public.executions ( id uuid primary key default uuid_generate_v4(), workflow_id uuid references public.workflows(id) on delete cascade, executed_at timestamptz default now(), duration_ms int, status text, raw_log jsonb ); create table public.exceptions ( id uuid primary key default uuid_generate_v4(), workflow_id uuid references public.workflows(id) on delete cascade, reported_at timestamptz default now(), severity exception_severity, e_type exception_type, notified jsonb, remedy text, status text default 'NEW' ); 

-- Credentials 
create table public.credentials ( id uuid primary key default uuid_generate_v4(), client_id uuid references public.clients(id) on delete cascade, service_name text, fields jsonb, connected boolean default false, created_at timestamptz default now() ); 

-- Helper boolean functions 
create or replace function public.is_admin()
returns boolean
language sql stable
as $$
  select current_app_role() = 'ADMIN';
$$;

create or replace function public.is_se()
returns boolean
language sql stable
as $$
  select current_app_role() = 'SE';
$$;

create or replace function public.is_client()
returns boolean
language sql stable
as $$
  select current_app_role() = 'CLIENT';
$$;

-- Enable RLS 
alter table public.users enable row level security; alter table public.clients enable row level security; alter table public.departments enable row level security; alter table public.se_assignments enable row level security; alter table public.client_users enable row level security; alter table public.plans enable row level security; alter table public.invoices enable row level security; alter table public.workflows enable row level security; alter table public.nodes enable row level security; alter table public.executions enable row level security; alter table public.exceptions enable row level security; alter table public.credentials enable row level security; alter table public.client_stage_progress enable row level security; alter table public.stages enable row level security; 

-- Policies --
--- USERS 
create policy "Admins read all users" on public.users for select using (is_admin()); 

--- CLIENTS 
create policy "Admin full access clients" on public.clients for all using (is_admin()); create policy "SE read/update assigned clients" on public.clients for all using ( is_se() and id in ( select client_id from public.se_assignments where se_id = auth.uid() ) ); create policy "Client read own client row" on public.clients for select using ( is_client() and id in ( select client_id from public.client_users where user_id = auth.uid() ) ); 

--- SE_ASSIGNMENTS 
create policy "Admin manage assignments" on public.se_assignments for all using (is_admin()); 

--- CLIENT_USERS 
create policy "Admin manage any client user" on public.client_users for all using (is_admin()); create policy "SE manage users of their clients" on public.client_users for all using ( is_se() and client_id in ( select client_id from public.se_assignments where se_id = auth.uid() ) ); create policy "Client read users of same client" on public.client_users for select using ( is_client() and client_id in ( select client_id from public.client_users where user_id = auth.uid() ) ); 

-- WORKFLOWS 
create policy "Admin full access workflows" on public.workflows for all using (is_admin()); create policy "SE workflows assigned clients" on public.workflows for all using ( is_se() and client_id in ( select client_id from public.se_assignments where se_id = auth.uid() ) ); create policy "Client workflows own client" on public.workflows for all using ( is_client() and client_id in ( select client_id from public.client_users where user_id = auth.uid() ) ); 

-- Mirror similar policies for nodes, executions, exceptions, invoices, credentials 
create policy "Admin full access nodes" on public.nodes for all using (is_admin()); create policy "SE nodes assigned clients" on public.nodes for all using ( is_se() and workflow_id in ( select id from public.workflows where client_id in ( select client_id from public.se_assignments where se_id = auth.uid() ) ) ); create policy "Client nodes own workflows" on public.nodes for all using ( is_client() and workflow_id in ( select id from public.workflows where client_id in ( select client_id from public.client_users where user_id = auth.uid() ) ) ); 

-- Indexes 
create index on public.se_assignments (se_id); create index on public.client_users (user_id); create index on public.workflows (client_id); create index on public.exceptions (workflow_id, severity); 

-- Schema comment 
comment on schema public is 'Braintrust Nexus – init migration';