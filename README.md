npm run dev

create branch as CR-<issue number> and push the changes to the branch and AWS amplify will create URL

Generate new images
root directory
delete /images folder
npm run process-images
npm run dev

npx shadcn@latest add popover

## Running the db locally

There is a copy of the database executable in the repo that you can run for local testing. You can also run it from anywhere else on your PC, but running it in the repo has the benefit of being with the pb_migration scripts. When you run it (pocketbase serve) with the migrations present, it will automatically apply them to your local db. You can also optionally manually apply them with "pocketbase migrate up."

note: You will need to create an admin account the first time you run it.

```bash
./pocketbase/pocketbase serve
```

## Replace pocketbase for Apple M2 chip

1. in root directory above src

2.

```bash
curl -L https://github.com/pocketbase/pocketbase/releases/download/v0.21.1/pocketbase_0.21.1_darwin_arm64.zip -o pb.zip && unzip pb.zip -d pocketbase && rm pb.zip
```

## Database Environments

The application uses two separate database environments:

1. **Pre-Production (Pre)**: Testing environment for validating changes before production
2. **Production (Prod)**: Live production environment

### Database Migrations

Migrations are used to manage database schema changes across environments.

#### Creating Migration Scripts

1. **Using Local UI**:

   - Run the database locally in the citiesrank repo
   - Make changes through the UI
   - Migration scripts will be generated automatically

2. **Manual Creation**:
   - Create migration scripts manually
   - Place them in `citiesrank/pocketbase/pb_migrations`
   - Test against your local database to validate

#### Deploying to Pre-Production

1. Add migration scripts to `citiesrank/pocketbase/pb_migrations`
2. Merge changes to master branch
3. Upon merge, migrations will automatically be applied to the Pre-Production database

```bash
# Run database locally
./pocketbase/pocketbase serve

# Manually apply migrations (optional)
pocketbase migrate up
```

## Reset the database back to the migrations

1. Stop your PocketBase server if it's running
2. Delete the pb_data directory (this contains your database)
3. Then start PocketBase again, which will recreate the database from your migrations

## Typegen

1. in the root directory
2. cd pocketbase
3. rm -rf pb_data
4. ./pocketbase serve
5. move to the root directory, run:

```bash
npm run generate-types
```

The prod one has to be manually triggered but you can change it to trigger on push/merge on main if u want

run a prod migration

1. go to github
2. actions
3. go to "deploy migrations to citiesrank"

run a prod release

1. it will release when you merge to main

setup ngrok

1. go to ngrok
2. sign up
3. brew install ngrok
4. ngrok config add-authtoken YOUR_AUTH_TOKEN

run ngrok
ngrok http 5173

npm run knip
