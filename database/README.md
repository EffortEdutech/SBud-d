# Database

Database assets live here.

Planned areas:

- `schema` - schema references and generated snapshots.
- `migrations` - version-controlled database migrations.
- `seeds` - development seed data.
- `policies` - security policies and Row Level Security definitions.
- `supabase/migrations` - Supabase CLI-generated migration files.

Never commit secrets or environment-specific credentials.

Create new Supabase migrations with:

```powershell
npx --yes supabase@latest migration new <name> --workdir database
```
