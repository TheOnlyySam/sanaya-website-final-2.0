# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Odoo service packages and requests

The portal-only `/service-packages` page presents Arabic-first Odoo consultation and support packages to logged-in users. Portal users can choose a package and submit the form at `/service-request`. The server validates the request, stores it in Supabase when server credentials are configured, emails both internal recipients, and then sends a localized customer confirmation. The form does not create an account, confirm an appointment, or process payment.

Package identifiers, localized names, integer IQD prices, duration, inclusions, and exclusions are maintained in `src/data/servicePackages.js`. Update that file when pricing or package content changes; the browser and server both resolve packages from this trusted catalog.

### Installation and migration

1. Copy `.env.example` to the environment configuration used by the frontend and serverless functions.
2. Apply `supabase/migrations/20260730_create_service_requests.sql` after the existing role and Academy migration. The service table is private and can only be read or updated by authenticated users whose `sanaya_file_user_roles.role` is `admin`.
3. Configure the SMTP and server-only Supabase values in the deployment provider. Never expose the service role key or SMTP password through a `REACT_APP_` variable.
4. Build and deploy the React app together with the functions in `api/`.

Required server values are `SANAYATECHS_SERVICE_EMAILS`, `SANAYATECHS_SERVICE_FROM_EMAIL`, SMTP credentials, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`. `SANAYATECHS_SERVICE_REPLY_TO`, timezone, attachment limit, allowed origins, and rate-limit settings should also be reviewed for each environment. The recipient list is server-side and can be changed without rebuilding the frontend.

The SMTP transport uses `SANAYATECHS_SERVICE_SMTP_*`. For safe local email tests, point these values to a development SMTP inbox such as Mailpit or the sandbox supplied by the transactional email provider. Do not use production recipients while testing. Customer confirmation failure is recorded but does not discard an internal request that has already been stored and emailed.

Use `npm start` to work on the public interface at `http://localhost:3000`. Because the backend follows the repository's Vercel function convention, use `npx vercel dev` with a local environment file when testing submission, persistence, and email delivery end to end.

Attachments are read by the browser and validated again by the server. Only PDF, PNG, JPEG, XLSX, CSV, and TXT are accepted. Extension, declared MIME type, file signature, filename, and size are checked. Attachments are sent to the internal recipients and only metadata is persisted; file contents are not placed in a public directory or retained in the database. The default is 3 MB so base64 JSON remains within common serverless body limits; confirm the provider limit before increasing it.

Admins can open `/portal/service-requests` to filter and search requests, view details, change status, add notes, resend a customer confirmation, and export the filtered list to CSV. This uses the existing Supabase login and admin role.

### Security and deployment checklist

- Apply the database migration and verify row-level security before enabling the route.
- Set a long random `SANAYATECHS_SERVICE_RATE_LIMIT_SALT` and the expected production origins.
- Confirm TLS works for the SMTP server; the service request transport does not disable certificate verification.
- Confirm both internal recipients receive a test request and the customer sandbox receives its localized confirmation.
- Verify the frontend and server attachment limits match the provider's body-size limit.
- Run `npm test -- --watchAll=false` and `npm run build` before deployment.
- Review deployment logs for operational event names only; customer descriptions and attachment content are not logged.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Sanaya Drive

The private drive area uses Supabase Auth and a private Supabase Storage bucket.

In Supabase:

- Create a project.
- Create a private Storage bucket named `sanaya-files`.
- Create user accounts in Authentication.
- Add Storage policies that allow authenticated users to select, insert, update, and delete objects in the `sanaya-files` bucket.
- In the app, normal `user` accounts can upload files, create folders, rename items, edit Office documents, and delete files. Only `admin` accounts can delete folders and manage visibility rules.

Policy expression for each operation:

```sql
bucket_id = 'sanaya-files'
```

Use the same expression for `WITH CHECK` on insert/update policies. Folder creation uses a hidden `.emptyFolderPlaceholder` object because Supabase Storage folders are virtual.

Set these environment variables in Vercel:

- `REACT_APP_SUPABASE_URL`: Supabase project URL.
- `REACT_APP_SUPABASE_ANON_KEY`: Supabase anon public key.
- `REACT_APP_SUPABASE_FILES_BUCKET`: usually `sanaya-files`.
- `REACT_APP_ONLYOFFICE_DOCUMENT_SERVER_URL`: OnlyOffice Docs server URL, for live editing Word, Excel, and PowerPoint files.
- `REACT_APP_ONLYOFFICE_CALLBACK_URL`: public callback URL, usually `https://office-api.example.com/onlyoffice/callback`.
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key, used only by the server callback to save edited Office files.
- `SUPABASE_FILES_BUCKET`: usually `sanaya-files`, used by the server callback.

Create this table to show who viewed, downloaded, or updated a file:

```sql
create table public.sanaya_file_activity (
  id bigint generated by default as identity primary key,
  file_path text not null,
  file_name text not null,
  action text not null check (action in ('viewed', 'downloaded', 'updated')),
  user_email text not null,
  created_at timestamptz not null default now()
);

alter table public.sanaya_file_activity enable row level security;

create policy "Authenticated users can read file activity"
on public.sanaya_file_activity
for select
to authenticated
using (true);

create policy "Authenticated users can create their file activity"
on public.sanaya_file_activity
for insert
to authenticated
with check (auth.email() = user_email);
```

Create these tables to allow admins to hide or show files and folders for selected user emails:

```sql
create table public.sanaya_file_user_roles (
  email text primary key,
  role text not null check (role in ('admin', 'user')) default 'user',
  created_at timestamptz not null default now()
);

alter table public.sanaya_file_user_roles enable row level security;

create policy "Authenticated users can read file roles"
on public.sanaya_file_user_roles
for select
to authenticated
using (true);

create table public.sanaya_file_visibility (
  path text not null,
  email text not null,
  hidden boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (path, email)
);

alter table public.sanaya_file_visibility enable row level security;

create policy "Authenticated users can read file visibility"
on public.sanaya_file_visibility
for select
to authenticated
using (true);

create policy "Admins can change file visibility"
on public.sanaya_file_visibility
for insert
to authenticated
with check (
  exists (
    select 1
    from public.sanaya_file_user_roles
    where email = auth.email()
    and role = 'admin'
  )
);

create policy "Admins can update file visibility"
on public.sanaya_file_visibility
for update
to authenticated
using (
  exists (
    select 1
    from public.sanaya_file_user_roles
    where email = auth.email()
    and role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.sanaya_file_user_roles
    where email = auth.email()
    and role = 'admin'
  )
);

insert into public.sanaya_file_user_roles (email, role)
values
  ('baqer.haider@sanayatechs.iq', 'user'),
  ('yousif.ahmed@sanayatechs.iq', 'user'),
  ('aws.wathiq@sanayatechs.iq', 'user'),
  ('hasan.sajid@sanayatechs.iq', 'user'),
  ('sama.kadhim@sanayatechs.iq', 'user'),
  ('adyan.saady@sanayatechs.iq', 'user')
on conflict (email) do update set role = excluded.role;
```

Create the matching Auth users in Supabase Dashboard > Authentication > Users > Add user:

- Email: each address above.
- Password: `11223344` for the five new users.
- Auto confirm user: enabled.

For `adyan.saady@sanayatechs.iq`, only update the role to `user` unless you also want to reset that user's password.

The navbar login opens `/login`. After login, users can access `/sanaya-files`.

## DigitalOcean Office Editing Server

Use this when the frontend is hosted on cPanel and files are stored in Supabase. The DigitalOcean droplet runs:

- ONLYOFFICE Docs Community for free browser editing.
- A small Node API that receives ONLYOFFICE save callbacks and writes edited files back to Supabase.
- Caddy for automatic HTTPS.

Create two DNS `A` records that point to the droplet IP, for example:

- `office.example.com`
- `office-api.example.com`

On the droplet:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin git
sudo systemctl enable --now docker
git clone <your-repo-url> sanaya-website
cd sanaya-website
cp deploy/digitalocean.env.example .env
```

Edit `.env`, then start the stack:

```bash
docker compose --env-file .env -f docker-compose.digitalocean.yml up -d --build
```

Set these frontend build variables before uploading the cPanel build:

```bash
REACT_APP_ONLYOFFICE_DOCUMENT_SERVER_URL=https://office.example.com
REACT_APP_ONLYOFFICE_CALLBACK_URL=https://office-api.example.com/onlyoffice/callback
```

Then rebuild and upload the `build` folder to cPanel.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
