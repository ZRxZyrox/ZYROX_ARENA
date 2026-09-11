-- Default admin roles. Run after 0001_init.sql. Create actual admin_users
-- rows separately (never via SQL with a plaintext password — hash with
-- bcryptjs first, e.g. via a one-off local script using the same
-- bcryptjs package the Worker uses for verification).

insert into admin_roles (name, permissions) values
  ('super_admin', '{
    "tournaments.write": true,
    "registrations.moderate": true,
    "registrations.export": true,
    "payments.verify": true,
    "audit_logs.read": true
  }'),
  ('tournament_manager', '{
    "tournaments.write": true,
    "registrations.moderate": true,
    "registrations.export": true,
    "payments.verify": false,
    "audit_logs.read": false
  }'),
  ('finance', '{
    "tournaments.write": false,
    "registrations.moderate": false,
    "registrations.export": true,
    "payments.verify": true,
    "audit_logs.read": true
  }'),
  ('support', '{
    "tournaments.write": false,
    "registrations.moderate": true,
    "registrations.export": false,
    "payments.verify": false,
    "audit_logs.read": false
  }')
on conflict (name) do nothing;
