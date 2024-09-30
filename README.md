# Transit Astrology
(This is a fork of a private repo, where development takes place)

## Initial Setup

- View the README and install dependencies in the respective project folders

- In the base `/env` folder duplicate `env.template.ts` and rename it to `env.ts`. Fill in missing values. Then run `npm run generate-env` to generate needed .env files throughout the mono repo

## Day-to-day workflow

### Start services

- Start docker desktop

```bash
npm run start:api # starts aws and supabase development servers
npm run start:react-native:development # react native against development server
npm run start:react-native:production # react native against production server
```

### Troubleshooting

_If you're getting issues running app on expo go on native devices:_

Use the [--tunnel](https://docs.expo.dev/more/expo-cli/#tunneling) flag. (Tunnel does not work with --offline flag)

```bash
# make sure you have ngrog installed
npm i -g @expo/ngrok
# use tunnel flag when starting app
npm run start:dev -- --tunnel
```
