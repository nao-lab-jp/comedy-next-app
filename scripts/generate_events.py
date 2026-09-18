"""
public/events.json を Supabase Postgres から直接生成するスクリプト。

Supabase egress quota超過時、PostgREST(REST API)は 402 exceed_egress_quota で
ブロックされるが、直接Postgres接続(5432番)は生きているためこちらを使う。

前提: リポジトリ直下の .env.local に SUPABASE_DB_* が設定されていること
(.env.local は gitignore 済みでリポジトリには含まれない)。

使い方:
    pip install psycopg2-binary
    python scripts/generate_events.py

恒久対応(GCP側のスクレイパー末尾にこの生成処理を追加して自動化)が入るまでの
つなぎ。詳細は HANDOFF-supabase-egress.md を参照。
"""
import json
import os
from pathlib import Path

import psycopg2

REPO_ROOT = Path(__file__).resolve().parent.parent


def load_env_local():
    env_path = REPO_ROOT / ".env.local"
    env = {}
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            env[key.strip()] = value.strip()
    return env


def main():
    env = {**load_env_local(), **os.environ}  # 環境変数があれば.env.localより優先

    conn = psycopg2.connect(
        host=env["SUPABASE_DB_HOST"],
        port=env.get("SUPABASE_DB_PORT", "5432"),
        dbname=env.get("SUPABASE_DB_NAME", "postgres"),
        user=env.get("SUPABASE_DB_USER", "postgres"),
        password=env["SUPABASE_DB_PASSWORD"],
        connect_timeout=15,
    )
    cur = conn.cursor()
    cur.execute("""
        select id, title, live_date, venue, performers, performers_clean,
               performers_kana, source_url, ticket_status
        from lives
        where live_date >= (now() at time zone 'Asia/Tokyo')::date - interval '1 day'
        order by live_date asc;
    """)
    cols = [d[0] for d in cur.description]
    rows = []
    for record in cur.fetchall():
        row = dict(zip(cols, record))
        row["live_date"] = row["live_date"].isoformat()
        rows.append(row)

    out_path = REPO_ROOT / "public" / "events.json"
    out_path.write_text(
        json.dumps(rows, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    print(f"wrote {len(rows)} rows to {out_path}")

    cur.close()
    conn.close()


if __name__ == "__main__":
    main()
