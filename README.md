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

#### If you're getting issues running app on expo go on native devices
Use the [--tunnel](https://docs.expo.dev/more/expo-cli/#tunneling) flag. (Tunnel does not work with --offline flag)
```bash
# make sure you have ngrog installed
npm i -g @expo/ngrok
# use tunnel flag when starting app
npm run start:dev -- --tunnel
```
npx expo start --tunnel


#### Start supabase locally in /supabase

```bash
# start and stop supabase
# `npx` prefix may not be needed, depending on how you set up supabase
npx supabase start
npx supabase stop
```