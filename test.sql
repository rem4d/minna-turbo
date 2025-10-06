create or replace function stat_list_fn(_source text)
  returns table (kanji text, pos smallint, cnt bigint)
    language plpgsql
as $$
begin
    return query
      select k.kanji,
        k."position",
        count(s.*) AS cnt
       FROM kanji k
         LEFT JOIN sentences s
         ON s.level = k."position" AND s.source = _source
-- AND s.unknown_kanji_number <= 2
      GROUP BY k.id
      ORDER BY k."position";
end;
$$;

