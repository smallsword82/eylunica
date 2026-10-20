begin;
create table ritma_private.lesson_catalog (
  key text primary key,
  expected jsonb not null
);
create table ritma_private.lesson_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  expected jsonb not null,
  created_at timestamptz not null default clock_timestamp(),
  used boolean not null default false
);
alter table ritma_private.lesson_catalog enable row level security;
alter table ritma_private.lesson_tickets enable row level security;
revoke all on ritma_private.lesson_catalog, ritma_private.lesson_tickets from public, anon, authenticated;

create function ritma_private.start_lesson(p_key text, p_math jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  player ritma_private.players%rowtype;
  expected jsonb;
  first_number integer;
  second_number integer;
  result integer;
  ticket uuid;
  today date := (now() at time zone 'Europe/Istanbul')::date;
begin
  select * into player from ritma_private.players where user_id = auth.uid() for update;
  if not found then raise exception 'Giriş yapmalısın.'; end if;
  if player.score_day = today and (player.daily_stars >= 20 or player.daily_questions >= 40) then return null; end if;
  if (select count(*) from ritma_private.lesson_tickets where user_id = auth.uid() and created_at > clock_timestamp() - interval '1 minute') >= 60 then
    raise exception 'Biraz bekleyip yeniden dene.';
  end if;
  if p_key = 'math' then
    if jsonb_typeof(p_math->'a') is distinct from 'number' or jsonb_typeof(p_math->'b') is distinct from 'number' then raise exception 'Geçersiz işlem.'; end if;
    first_number := (p_math->>'a')::integer;
    second_number := (p_math->>'b')::integer;
    if first_number < 0 or first_number > 10000 or second_number < 0 or second_number > 10000 then raise exception 'Geçersiz işlem.'; end if;
    case p_math->>'operation'
      when 'add' then result := first_number + second_number;
      when 'subtract' then result := first_number - second_number;
      when 'multiply' then result := first_number * second_number;
      when 'divide' then
        if second_number = 0 or first_number % second_number <> 0 then raise exception 'Geçersiz işlem.'; end if;
        result := first_number / second_number;
      else raise exception 'Geçersiz işlem.';
    end case;
    expected := jsonb_build_object('answer', result);
  else
    select catalog.expected into expected from ritma_private.lesson_catalog catalog where key = p_key;
    if not found then raise exception 'Bilinmeyen eğitim sorusu.'; end if;
  end if;
  delete from ritma_private.lesson_tickets where user_id = auth.uid() and created_at < clock_timestamp() - interval '1 day';
  insert into ritma_private.lesson_tickets(user_id, expected) values(auth.uid(), expected) returning id into ticket;
  return jsonb_build_object('id', ticket);
end;
$$;

create function ritma_private.answer_lesson(p_id uuid, p_answer jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  player ritma_private.players%rowtype;
  ticket ritma_private.lesson_tickets%rowtype;
  correct boolean;
  today date := (now() at time zone 'Europe/Istanbul')::date;
begin
  select * into player from ritma_private.players where user_id = auth.uid() for update;
  if not found then raise exception 'Giriş yapmalısın.'; end if;
  select * into ticket from ritma_private.lesson_tickets where id = p_id and user_id = auth.uid() for update;
  if not found then raise exception 'Geçersiz eğitim bileti.'; end if;
  if ticket.used then return ritma_private.my_player(); end if;
  update ritma_private.lesson_tickets set used = true where id = p_id;
  if ticket.created_at < clock_timestamp() - interval '2 hours' or (ticket.created_at at time zone 'Europe/Istanbul')::date <> today then return ritma_private.my_player(); end if;
  if player.score_day = today and (player.daily_stars >= 20 or player.daily_questions >= 40) then return ritma_private.my_player(); end if;
  if ticket.expected ? 'sequence' then
    correct := ticket.expected->'sequence' = p_answer->'sequence';
  else
    correct := ticket.expected->'answer' = p_answer->'answer';
    if ticket.expected ? 'evidence' then
      correct := correct and (ticket.expected->'evidence') @> jsonb_build_array(p_answer->'evidence');
    end if;
  end if;
  update ritma_private.players set
    stars = stars + case when correct then 1 else 0 end,
    daily_stars = (case when score_day = today then daily_stars else 0 end) + case when correct then 1 else 0 end,
    daily_questions = (case when score_day = today then daily_questions else 0 end) + 1,
    score_day = today
  where user_id = auth.uid();
  return ritma_private.my_player();
end;
$$;

revoke execute on function ritma_private.start_lesson(text, jsonb), ritma_private.answer_lesson(uuid, jsonb) from public, anon, authenticated;
grant execute on function ritma_private.start_lesson(text, jsonb), ritma_private.answer_lesson(uuid, jsonb) to authenticated;
create function public.lesson_start(p_key text, p_math jsonb default null) returns jsonb
language sql security invoker set search_path = '' as $$ select ritma_private.start_lesson(p_key, p_math); $$;
create function public.lesson_answer(p_id uuid, p_answer jsonb) returns jsonb
language sql security invoker set search_path = '' as $$ select ritma_private.answer_lesson(p_id, p_answer); $$;
revoke execute on function public.lesson_start(text, jsonb), public.lesson_answer(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.lesson_start(text, jsonb), public.lesson_answer(uuid, jsonb) to authenticated;
revoke execute on function public.league_question(), public.league_answer(uuid, integer), ritma_private.start_question(), ritma_private.submit_answer(uuid, integer) from authenticated;
commit;
