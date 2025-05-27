-- ---------- helper: translate UI filter → daterange ----------
create or replace function public.dashboard_range(p_filter text)
returns tstzrange
language sql stable as $$
  select case p_filter
    when '7d'  then tstzrange(now() - interval '7 days',  now(), '[]')
    when '30d' then tstzrange(now() - interval '30 days', now(), '[]')
    when 'mtd' then tstzrange(date_trunc('month',   now()), now(), '[]')
    when 'qtd' then tstzrange(date_trunc('quarter', now()), now(), '[]')
    when 'ytd' then tstzrange(date_trunc('year',    now()), now(), '[]')
    else              tstzrange(timestamp '2020-01-01 00:00:00+00', now(), '[]')
  end;
$$;

-- ---------- RPC: KPI cards (fixed) ----------
create or replace function public.get_admin_dashboard_kpis(p_filter text)
returns table(
  total_workflows   bigint,
  total_exceptions  bigint,
  time_saved        numeric,
  revenue           numeric,
  active_clients    bigint
)
language plpgsql stable as $$
declare
  r daterange := dashboard_range(p_filter);   -- inclusive date range
begin
  /*
    We return ONE row that contains five scalar sub-queries.
    No FROM clause => no “alias required” problem.
  */
  return query
  select
    -- # Workflows created in range
    (select count(*) from workflows  where created_at  <@ r)                                         as total_workflows,

    -- # Exceptions reported in range
    (select count(*) from exceptions where reported_at <@ r)                                         as total_exceptions,

    -- Sum of time_saved_per_exec × executions-in-range
    (
      select coalesce(
        sum(w.time_saved_per_exec *
            (
              select count(*) 
              from executions e
              where e.workflow_id = w.id
                and e.executed_at <@ r
            )
        ), 0)
      from workflows w
    )                                                                                                as time_saved,

    -- Sum of invoice.amount within range
    (select coalesce(sum(amount),0) from invoices where invoice_date <@ r)                           as revenue,

    -- All clients (no date filter)
    (select count(*) from clients)                                                                   as active_clients;
end;
$$;

-- ---------- RPC: Clients table ----------
create or replace function public.get_admin_clients(
  p_filter text,
  p_sort   text default 'name',
  p_dir    text default 'asc')
returns table(
  id              uuid,
  name            text,
  contract_start  date,
  workflows       bigint,
  nodes           bigint,
  executions      bigint,
  exceptions      bigint,
  revenue         numeric
)
language plpgsql stable as $$
declare
  r daterange := dashboard_range(p_filter);
  order_clause text := format('%I %s', p_sort,
                     case when p_dir ilike 'desc' then 'desc' else 'asc' end);
begin
  return query execute format($q$
    select
      c.id,
      c.name,
      c.contract_start_date,
      (select count(*) from workflows w where w.client_id = c.id) as workflows,
      (select count(*) from nodes     n where n.workflow_id in (select id from workflows where client_id = c.id)) as nodes,
      (select count(*) from executions e where e.workflow_id in (select id from workflows where client_id = c.id) and e.executed_at <@ %L) as executions,
      (select count(*) from exceptions ex where ex.workflow_id in (select id from workflows where client_id = c.id) and ex.reported_at <@ %L) as exceptions,
      (select coalesce(sum(amount),0) from invoices i where i.client_id = c.id and i.invoice_date <@ %L) as revenue
    from clients c
    order by %s
  $q$, r, r, r, order_clause);
end;
$$;