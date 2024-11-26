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

1. go to root of repo
2. run this command
```bash
curl -L https://github.com/pocketbase/pocketbase/releases/download/v0.21.1/pocketbase_0.21.1_darwin_arm64.zip -o pb.zip && unzip pb.zip -d pocketbase && rm pb.zip
```
3. "replace pcoketbase/pocketbase?" [y]
4. Don't commit it
5. Might have to go into System Preferences -> Security & Privacy and approve it manually to run

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

## Environment Variables

The following environment variables need to be configured in your [.env](cci:7://file:///Users/austinschrader/citiesrank/.env:0:0-0:0) file:

### Development Configuration
- `VITE_ENV`: Set to "development" for local development
- `VITE_API_URL_DEVELOPMENT`: URL for local API (default: http://127.0.0.1:8090)
- `VITE_API_URL_PRODUCTION`: URL for production API
- `VITE_CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name for image uploads
- `PIXABAY_API_KEY`: Your Pixabay API key for fetching images

Example [.env](cci:7://file:///Users/austinschrader/citiesrank/.env:0:0-0:0) file:
```env
VITE_ENV=development
VITE_API_URL_DEVELOPMENT=http://127.0.0.1:8090
VITE_API_URL_PRODUCTION=https://api.citiesrank.com
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
PIXABAY_API_KEY=your_pixabay_api_key


## Oauth
- cant run db locally
- pre/prod dbs have to point to https