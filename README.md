# Transit Astrology

## Development workflow:

### Initial Setup and more detailed management

View the README in the respective project folders

### Day-to-day workflow


#### Run device simulator in /react-native-app
```bash
# run ONE of these commands:
npm run android:local # run android on local network
npm run android:prod # run android on prod network
npm run ios:local # run ios on local network
npm run ios:prod # run ios on prod network
npm run ios:prod --simulator='iPhone 14' # how to select specific device
npm run start:local # start one or multiple instances locally
npm run start:prod # start one or multiple instances on prod
```

#### Start supabase locally in /supabase

```bash
# start and stop supabase
# `npx` prefix may not be needed, depending on how you set up supabase
npx supabase start
npx supabase stop
```