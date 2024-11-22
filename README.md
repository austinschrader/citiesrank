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

```bash
curl -L https://github.com/pocketbase/pocketbase/releases/download/v0.21.1/pocketbase_0.21.1_darwin_arm64.zip -o pb.zip && unzip pb.zip -d pocketbase && rm pb.zip
```
