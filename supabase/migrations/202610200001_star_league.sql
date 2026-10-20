begin;
create schema if not exists ritma_private;
revoke all on schema ritma_private from public;
grant usage on schema ritma_private to anon, authenticated;

create table ritma_private.players (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null unique check (nickname ~ '^[a-z][a-z0-9_]{2,19}$'),
  stars integer not null default 0 check (stars >= 0),
  visible boolean not null default true,
  score_day date,
  daily_stars integer not null default 0,
  daily_questions integer not null default 0,
  issued_at timestamptz,
  challenge_id uuid,
  expected integer,
  expires_at timestamptz
);
alter table ritma_private.players enable row level security;
revoke all on ritma_private.players from public, anon, authenticated;

create function ritma_private.my_player() returns jsonb
language sql security definer set search_path = '' as $$
  select jsonb_build_object('nickname', nickname, 'stars', stars, 'visible', visible,
    'dailyStars', case when score_day = (now() at time zone 'Europe/Istanbul')::date then daily_stars else 0 end)
  from ritma_private.players where user_id = auth.uid();
$$;

create function ritma_private.register_player(p_nickname text) returns jsonb
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'Giriş yapmalısın.'; end if;
  if p_nickname is null or p_nickname !~ '^[a-z][a-z0-9_]{2,19}$' then
    raise exception 'Takma ad 3–20 karakter olmalı; küçük harfle başlamalı, yalnız a-z, 0-9 ve _ içermeli.';
  end if;
  if exists(select 1 from ritma_private.players where user_id = auth.uid()) then
    return ritma_private.my_player();
  end if;
  insert into ritma_private.players(user_id, nickname) values(auth.uid(), p_nickname);
  return ritma_private.my_player();
exception when unique_violation then
  raise exception 'Bu takma ad kullanılıyor. Başka bir takma ad seç.';
end;
$$;

create function ritma_private.leaderboard() returns jsonb
language sql stable security definer set search_path = '' as $$
  select coalesce(jsonb_agg(jsonb_build_object('rank', place, 'nickname', nickname, 'stars', stars) order by place), '[]'::jsonb)
  from (select row_number() over(order by stars desc, nickname) as place, nickname, stars
    from ritma_private.players where visible and stars > 0 order by stars desc, nickname limit 50) as leaders;
$$;

create function ritma_private.set_visibility(p_visible boolean) returns jsonb
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or p_visible is null then raise exception 'Giriş yapmalısın.'; end if;
  update ritma_private.players set visible = p_visible where user_id = auth.uid();
  return ritma_private.my_player();
end;
$$;

create function ritma_private.start_question() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  player ritma_private.players%rowtype;
  first_number integer;
  second_number integer;
  operation integer;
  correct_answer integer;
  symbol text;
  ticket uuid := gen_random_uuid();
  today date := (now() at time zone 'Europe/Istanbul')::date;
begin
  select * into player from ritma_private.players where user_id = auth.uid() for update;
  if not found then raise exception 'Önce giriş yapıp takma adını oluştur.'; end if;
  if player.issued_at > clock_timestamp() - interval '1 second' then raise exception 'Biraz bekleyip yeniden dene.'; end if;
  if player.score_day = today and (player.daily_stars >= 20 or player.daily_questions >= 40) then
    raise exception 'Bugünkü lig turunu tamamladın. Normal öğrenme bölümlerinde devam edebilirsin; lig yarın yenilenir.';
  end if;
  first_number := 1 + floor(random() * 10)::integer;
  second_number := 1 + floor(random() * 10)::integer;
  operation := floor(random() * 3)::integer;
  if operation = 0 then correct_answer := first_number + second_number; symbol := '+';
  elsif operation = 1 then
    if first_number < second_number then
      correct_answer := first_number; first_number := second_number; second_number := correct_answer;
    end if;
    correct_answer := first_number - second_number; symbol := '−';
  else correct_answer := first_number * second_number; symbol := '×'; end if;
  update ritma_private.players set
    daily_stars = case when score_day = today then daily_stars else 0 end,
    daily_questions = case when score_day = today then daily_questions + 1 else 1 end,
    score_day = today, issued_at = clock_timestamp(), challenge_id = ticket,
    expected = correct_answer, expires_at = clock_timestamp() + interval '15 minutes'
  where user_id = auth.uid();
  return jsonb_build_object('id', ticket, 'prompt', first_number || ' ' || symbol || ' ' || second_number || ' = ?');
end;
$$;

create function ritma_private.submit_answer(p_id uuid, p_answer integer) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  player ritma_private.players%rowtype;
  is_correct boolean;
begin
  select * into player from ritma_private.players where user_id = auth.uid() for update;
  if not found then raise exception 'Giriş yapmalısın.'; end if;
  if p_id is null or player.challenge_id is distinct from p_id or player.expires_at < clock_timestamp() then
    raise exception 'Bu soru tamamlandı veya süresi doldu. Yeni bir soru aç.';
  end if;
  if player.score_day is distinct from (now() at time zone 'Europe/Istanbul')::date then
    raise exception 'Yeni gün başladı. Yeni bir soru aç.';
  end if;
  if p_answer is null or p_answer < 0 or p_answer > 100 then raise exception 'Yanıt 0 ile 100 arasında olmalı.'; end if;
  is_correct := player.expected = p_answer;
  update ritma_private.players set
    stars = stars + case when is_correct then 1 else 0 end,
    daily_stars = daily_stars + case when is_correct then 1 else 0 end,
    challenge_id = null, expected = null, expires_at = null
  where user_id = auth.uid();
  return jsonb_build_object('correct', is_correct, 'answer', player.expected, 'player', ritma_private.my_player());
end;
$$;

create function ritma_private.delete_account() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'Giriş yapmalısın.'; end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke execute on all functions in schema ritma_private from public, anon, authenticated;
grant execute on function ritma_private.leaderboard() to anon, authenticated;
grant execute on function ritma_private.my_player(), ritma_private.register_player(text),
  ritma_private.set_visibility(boolean), ritma_private.start_question(),
  ritma_private.submit_answer(uuid, integer), ritma_private.delete_account() to authenticated;

create function public.league_board() returns jsonb language sql security invoker set search_path = '' as $$ select ritma_private.leaderboard(); $$;
create function public.league_me() returns jsonb language sql security invoker set search_path = '' as $$ select ritma_private.my_player(); $$;
create function public.league_join(p_nickname text) returns jsonb language sql security invoker set search_path = '' as $$ select ritma_private.register_player(p_nickname); $$;
create function public.league_visibility(p_visible boolean) returns jsonb language sql security invoker set search_path = '' as $$ select ritma_private.set_visibility(p_visible); $$;
create function public.league_question() returns jsonb language sql security invoker set search_path = '' as $$ select ritma_private.start_question(); $$;
create function public.league_answer(p_id uuid, p_answer integer) returns jsonb language sql security invoker set search_path = '' as $$ select ritma_private.submit_answer(p_id, p_answer); $$;
create function public.league_delete_account() returns void language sql security invoker set search_path = '' as $$ select ritma_private.delete_account(); $$;
revoke execute on function public.league_board(), public.league_me(), public.league_join(text),
  public.league_visibility(boolean), public.league_question(), public.league_answer(uuid, integer),
  public.league_delete_account() from public, anon, authenticated;
grant execute on function public.league_board() to anon, authenticated;
grant execute on function public.league_me(), public.league_join(text), public.league_visibility(boolean),
  public.league_question(), public.league_answer(uuid, integer), public.league_delete_account() to authenticated;
commit;
