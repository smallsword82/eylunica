begin;
create function ritma_private.validate_username_account() returns trigger
language plpgsql set search_path = '' as $$
begin
  if tg_op = 'UPDATE' and new.email is distinct from old.email then
    raise exception 'Kullanıcı adı değiştirilemez.';
  end if;
  if new.email is null or new.email !~ '^[a-z][a-z0-9_]{2,19}@accounts\.eylunica\.netlify\.app$' then
    raise exception 'Geçerli bir RİTMA kullanıcı adı gerekli.';
  end if;
  if tg_op = 'INSERT' and (new.raw_user_meta_data->>'league_consent') is distinct from 'true' then
    raise exception 'Lig paylaşım bilgileri onaylanmalı.';
  end if;
  return new;
end;
$$;
create trigger ritma_username_validation before insert or update of email on auth.users
for each row execute function ritma_private.validate_username_account();

create function ritma_private.create_username_player() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into ritma_private.players(user_id, nickname)
  values(new.id, split_part(new.email, '@', 1));
  return new;
end;
$$;
create trigger ritma_username_player after insert on auth.users
for each row execute function ritma_private.create_username_player();
revoke execute on function ritma_private.validate_username_account(), ritma_private.create_username_player() from public, anon, authenticated;
commit;
