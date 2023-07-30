# Supabase Getting Started

## Step 0

> You need to install [docker desktop](https://www.docker.com/products/docker-desktop/) so that supabase can run locally on docker. You should not need to do anything after installing.

## Step 1: Set Up Supabase CLI

Make sure you are in the root directory of the repo. This is the directory that contains the directory `supabase`. Run the following commands.

```bash
npm install supabase --save-dev
npm update supabase --save-dev
```

Stop any locally running Supabase containers with the following command.

```bash
npx supabase stop --no-backup
```

## Step 2: Update the .env file inside of `supabase/functions` dir.

- Duplicate `.env.template`
- Rename it to `.env`
- Fill out missing values

## Step 3: Set Up Supabase

Again, you will run all of these from inside of the root directory of the repo. This is the directory containing the `supabase` directory.

Login to supabase:
```bash
supabase login
```

Initialize supabase (this might fail because we already have a config.toml and that is okay.):
```bash
supabase init
```

Link the project (You will need the db password.):
```bash
supabase link --project-ref <project ref key>
```

## (Optional) Step 4: Set Up Deno

I think this is optional but you might need to set up Deno to get things to work properly and have correct autocomeplete.

Install the [Deno extension](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno) in Visual Studio.

In the command pallet search `Deno: Initialize Workspace Configuration` and follow the prompts.

Inside of `.vscode/settings.json` (if you added this) you'll likely want a similar set up to this:
```json
{
    "deno.enable": true,
    "deno.unstable": true,
    "deno.lint": true,
    // This is the main part that helps with linking files.
    "deno.importMap": "./supabase/functions/import_map.json"
}
```

## Step 5: Run Supabase Locally

Again, you will run all of these from inside of the root directory of the repo. This is the directory containing the `supabase` directory.

Run the following command to start Supabase:
```bash
supabase start
```
This command will output all of the important local links and keys. The main link should be the studio URL that should be `http://localhost:54323` if you didn't change the config.toml.

This will also pick up the database configuration in `supabase/migrations`.

To stop supabase you can run the command:
```bash
supabase stop
```
You can add the flags --backup to save the current database config.

## Step 6: Run Edge Functions

From the repo root directory that contains `supabase` directory run the following command:
```bash
supabase functions serve
```

You will now be able to call the different edge functions at the address `http://localhost:54321/functions/v1/<function-name>`

## Step 7: Save and deploy database schemas

From the repo root directory that contains `supabase` directory run the following command to output a new database migration:
```bash
supabase db diff --use-migra -f initial_schema
```

Then you can run this command to deploy that schema to the remote supabase:
```bash
supabase db push
```