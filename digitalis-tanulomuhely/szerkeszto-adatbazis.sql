begin;
create schema if not exists tanulomuhely_private;
revoke all on schema tanulomuhely_private from public, anon, authenticated;

create table tanulomuhely_private.catalog (
  singleton boolean primary key default true check (singleton),
  revision integer not null default 0,
  items jsonb not null
);
create table tanulomuhely_private.teacher (
  singleton boolean primary key default true check (singleton),
  google_email text not null check (google_email = lower(btrim(google_email)))
);
alter table tanulomuhely_private.catalog enable row level security;
alter table tanulomuhely_private.teacher enable row level security;
insert into tanulomuhely_private.catalog(items) values ($catalog$[{"id":"en","title":"Angol nyelv","grades":[["5","5. osztály",[["AngolApp 5","Tervezett","A modul később bővül tananyaggal és feladatokkal.",""]]],["6","6. osztály",[["AngolApp 6","Tervezett","A modul később bővül tananyaggal és feladatokkal.",""]]],["7","7. osztály",[["Family – Család","PDF · tanulói anyag","Letölthető feladatlap; a Google Drive meglévő hozzáférése érvényes.","https://drive.google.com/file/d/1RWfgX-EJ4APrnaQsrkvJGU2HMHQAH1Nh/view?usp=drivesdk"],["Simple Present","PDF · tanulói anyag","Letölthető feladatlap; a Google Drive meglévő hozzáférése érvényes.","https://drive.google.com/file/d/1p0iGitE7V85Az-YP29UytutghVJgTy8d/view?usp=drivesdk"],["AngolApp 7. oszt.","Interaktív alkalmazás","Olvasmányok, szókincs, hallásértés, nyelvtan és tesztek.","angolapp-7/"]]],["8","8. osztály",[["AngolApp 8. oszt.","Interaktív alkalmazás","Olvasmányok, szókincs, hallásértés, nyelvtan és tesztek.","angolapp-8/"]]],["other","Több évfolyam · felnőttek",[["English Adventure","Interaktív angol játék","Nyelvi küldetés és feladatok.","english-adventure/"],["Idiom Adventure","B1 · felnőtteknek","Angol idiómák és példamondatok.","idiom-adventure/"]]]]},{"id":"grammar","title":"Magyar nyelvtan","grades":[["5","5. osztály",[["Betűsziget","Interaktív alkalmazás","Válaszd ki az alkalmazásban is a megfelelő évfolyamot.","abece-kaland/betusziget/?osztaly=5"],["Ábécé-kaland","Interaktív játék","Betűismeret és ábécérend.","abece-kaland/"],["Bábel tornya","Interaktív játék","Küldetés az elveszett betűkért.","babel-tornya-jatek/"],["A kiejtés szerinti írásmód","PDF · tanulói anyag","Letölthető feladatlap; a Google Drive meglévő hozzáférése érvényes.","https://drive.google.com/file/d/1kb2qmDW4frRTJ8r9jYzWJwbu55y-3SeV/view?usp=drivesdk"],["A magyar ábécé","PDF · tanulói anyag","Letölthető feladatlap; a Google Drive meglévő hozzáférése érvényes.","https://drive.google.com/file/d/1GBRZCYsDkxB8LD3S07HFwrdVVkWLY-1F/view?usp=drivesdk"]]],["6","6. osztály",[["Betűsziget","Interaktív alkalmazás","Válaszd ki az alkalmazásban is a megfelelő évfolyamot.","abece-kaland/betusziget/?osztaly=6"],["Az igekötők","PDF · tanulói anyag","Letölthető feladatlap; a Google Drive meglévő hozzáférése érvényes.","https://drive.google.com/file/d/1HTfRgCUf9YCIBz_LRNquilcXI10NiCs-/view?usp=drivesdk"]]],["7","7. osztály",[["Betűsziget","Interaktív alkalmazás","Válaszd ki az alkalmazásban is a megfelelő évfolyamot.","abece-kaland/betusziget/?osztaly=7"],["Az egyszerű mondat szerkezete","PDF · tanulói anyag","Letölthető feladatlap; a Google Drive meglévő hozzáférése érvényes.","https://drive.google.com/file/d/1j1cn8_Qep_kSQmqhE0C3hguY8diE4il5/view?usp=drivesdk"]]],["8","8. osztály",[["Betűsziget","Interaktív alkalmazás","Válaszd ki az alkalmazásban is a megfelelő évfolyamot.","abece-kaland/betusziget/?osztaly=8"]]]]},{"id":"lit","title":"Magyar irodalom","grades":[["5","5. osztály",[["Daidalosz és Ikarosz","PDF · tanulói anyag","Letölthető feladatlap; a Google Drive meglévő hozzáférése érvényes.","https://drive.google.com/file/d/1DEjguxfS5wo8MhIpznsrt-UvdsMt-rFQ/view?usp=drivesdk"],["Mondák – A csodaszarvas","PDF · tanulói anyag","Letölthető feladatlap; a Google Drive meglévő hozzáférése érvényes.","https://drive.google.com/file/d/1V5NBdwLTPWUVshfWb8OjlKO3Isp_G-uG/view?usp=drivesdk"]]],["6","6. osztály",[["6. osztályos irodalmi tananyag","Tervezett","A modul később bővül tananyaggal és feladatokkal.",""]]],["7","7. osztály",[["Irodalmi kaland","Interaktív játék","Irodalmi feladatok.","english-adventure/irodalom7/"],["Zrínyi Miklós és a barokk","PDF · tanulói anyag","Letölthető feladatlap; a Google Drive meglévő hozzáférése érvényes.","https://drive.google.com/file/d/1sf3tmd4dcvzN6ZvZJjfUJNE50mMMbGMJ/view?usp=drivesdk"]]],["8","8. osztály",[["8. osztályos irodalmi tananyag","Tervezett","A modul később bővül tananyaggal és feladatokkal.",""]]],["other","Kiegészítő irodalmi játékok",[["Tintalabor","Kosztolányi-küldetés","Irodalmi játék.","abece-kaland/kosztolanyi-tintalabor/"],["Meseország négy őrzője","Kooperatív mesejáték","Közös mesei küldetés.","meseorszag/"]]]]},{"id":"hu","title":"Magyar mint idegen nyelv · Венгерский язык","grades":[["allhu","Teljes tanfolyam · Весь курс",[["Magyar–orosz Tanműhely","A1–B2 · orosz anyanyelvűeknek","Венгерский с нуля: слова, грамматика и упражнения.","magyar-orosz/"]]],["A1","A1 nyelvi szint",[["A1 · Венгерский язык","Fejlesztés alatt álló tanfolyami szint","A meglévő A1 tananyag közvetlen elérése.","magyar-orosz/a1.html"]]],["A2","A2 nyelvi szint",[["A2 · Венгерский язык","Fejlesztés alatt álló tanfolyami szint","A meglévő A2 tananyag közvetlen elérése.","magyar-orosz/a2.html"]]],["B1","B1 nyelvi szint",[["B1 · Венгерский язык","Fejlesztés alatt álló tanfolyami szint","A meglévő B1 tananyag közvetlen elérése.","magyar-orosz/b1.html"]]],["B2","B2 nyelvi szint",[["B2 · Венгерский язык","Fejlesztés alatt álló tanfolyami szint","A meglévő B2 tananyag közvetlen elérése.","magyar-orosz/b2.html"]]],["culture","Kulturális ismeretek · Культура",[["Magyar kulturális ismeretek","Orosz nyelvű vizsgafelkészítés","Темы, вопросы и итоговый тест.","magyar-kulturalis-ismeretek/"]]],["other","Kiegészítő anyagok",[["A Túró Rudi története","PDF · tanulói anyag","Letölthető feladatlap; a Google Drive meglévő hozzáférése érvényes.","https://drive.google.com/file/d/14q8s9w6HoaRBlNPNBU_ee9h6hkwSYQnA/view?usp=drivesdk"]]]]}]$catalog$::jsonb);

create function tanulomuhely_private.require_teacher() returns void
language plpgsql stable security definer set search_path = '' as $$
begin
  if auth.uid() is null or not exists (
    select 1
    from auth.users u
    join auth.identities i on i.user_id = u.id and i.provider = 'google'
    join tanulomuhely_private.teacher t on lower(u.email) = t.google_email
    where u.id = auth.uid()
      and u.raw_app_meta_data->>'provider' = 'google'
      and lower(i.identity_data->>'email') = t.google_email
      and i.identity_data->>'email_verified' = 'true'
      and jsonb_typeof(auth.jwt()->'amr') = 'array'
      and auth.jwt()->'amr' @> '[{"method":"oauth"}]'::jsonb
  ) then
    raise insufficient_privilege using message = 'Restricted to the authorized Google account';
  end if;
end $$;

create function public.tanulomuhely_edit_catalog() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  perform tanulomuhely_private.require_teacher();
  return (select jsonb_build_object('catalog', items, 'revision', revision) from tanulomuhely_private.catalog);
end $$;

create function public.tanulomuhely_public_catalog() returns jsonb
language sql stable security definer set search_path = '' as $$
  select coalesce((
    select jsonb_agg(jsonb_set(subject, '{grades}', coalesce((
      select jsonb_agg(jsonb_set(grade, '{2}', coalesce((
        select jsonb_agg(item order by ai)
        from jsonb_array_elements(grade->2) with ordinality a(item, ai)
        where item->4 is distinct from 'true'::jsonb
      ), '[]'::jsonb)) order by gi)
      from jsonb_array_elements(subject->'grades') with ordinality g(grade, gi)
    ), '[]'::jsonb)) order by si)
    from jsonb_array_elements(c.items) with ordinality s(subject, si)
  ), '[]'::jsonb)
  from tanulomuhely_private.catalog c;
$$;

create function public.tanulomuhely_publish_catalog(next_catalog jsonb, expected_revision integer) returns integer
language plpgsql security definer set search_path = '' as $$
declare
  subject jsonb;
  grade jsonb;
  item jsonb;
  link text;
  updated_revision integer;
  subject_ids text[] := '{}';
  grade_ids text[];
begin
  perform tanulomuhely_private.require_teacher();
  if jsonb_typeof(next_catalog) is distinct from 'array' or octet_length(next_catalog::text) > 524288 then
    raise invalid_parameter_value;
  end if;
  for subject in select value from jsonb_array_elements(next_catalog) loop
    if jsonb_typeof(subject->'id') is distinct from 'string'
       or subject->>'id' !~ '^[a-zA-Z0-9_-]+$' or subject->>'id' = 'all'
       or subject->>'id' = any(subject_ids)
       or jsonb_typeof(subject->'title') is distinct from 'string' or btrim(subject->>'title') = ''
       or jsonb_typeof(subject->'grades') is distinct from 'array' then
      raise invalid_parameter_value;
    end if;
    subject_ids := array_append(subject_ids, subject->>'id');
    grade_ids := '{}';
    for grade in select value from jsonb_array_elements(subject->'grades') loop
      if jsonb_typeof(grade) is distinct from 'array' or jsonb_array_length(grade) <> 3
         or jsonb_typeof(grade->0) is distinct from 'string' or grade->>0 !~ '^[a-zA-Z0-9_-]+$'
         or grade->>0 = 'all' or grade->>0 = any(grade_ids)
         or jsonb_typeof(grade->1) is distinct from 'string' or btrim(grade->>1) = ''
         or jsonb_typeof(grade->2) is distinct from 'array' then
        raise invalid_parameter_value;
      end if;
      grade_ids := array_append(grade_ids, grade->>0);
      for item in select value from jsonb_array_elements(grade->2) loop
        if jsonb_typeof(item) is distinct from 'array' or jsonb_array_length(item) not between 4 and 5
           or jsonb_typeof(item->0) is distinct from 'string' or btrim(item->>0) = ''
           or jsonb_typeof(item->1) is distinct from 'string'
           or jsonb_typeof(item->2) is distinct from 'string'
           or jsonb_typeof(item->3) is distinct from 'string'
           or (jsonb_array_length(item)=5 and jsonb_typeof(item->4) is distinct from 'boolean') then
          raise invalid_parameter_value;
        end if;
        link := item->>3;
        if link <> '' and (link ~ '[[:space:][:cntrl:]]' or strpos(link, chr(92)) > 0 or
          (link !~ '^https://[A-Za-z0-9][A-Za-z0-9.-]*(:[0-9]+)?([/?#]|$)' and
            (link !~ '^[A-Za-z0-9][A-Za-z0-9_./?=&%#-]*$' or position('..' in link)>0))) then
          raise invalid_parameter_value;
        end if;
      end loop;
    end loop;
  end loop;
  update tanulomuhely_private.catalog set items = next_catalog, revision = revision + 1
  where revision = expected_revision returning revision into updated_revision;
  if not found then raise serialization_failure; end if;
  return updated_revision;
end $$;

revoke all on function tanulomuhely_private.require_teacher() from public, anon, authenticated;
revoke all on function public.tanulomuhely_public_catalog() from public, anon, authenticated;
revoke all on function public.tanulomuhely_edit_catalog() from public, anon, authenticated;
revoke all on function public.tanulomuhely_publish_catalog(jsonb, integer) from public, anon, authenticated;
grant execute on function public.tanulomuhely_public_catalog() to anon, authenticated;
grant execute on function public.tanulomuhely_edit_catalog() to authenticated;
grant execute on function public.tanulomuhely_publish_catalog(jsonb, integer) to authenticated;
commit;
