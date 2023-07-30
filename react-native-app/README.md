# React Native Getting Started

## Step 0:

> Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Install Dependencies

Make sure you're in the root directory of the react native app (where the `package.json` lives) and Run the following commands:

```bash
npm install # js dependencies
npx pod-install ios # ios dependencies
```

## Step 2: Update the .env file

- Duplicate `.env.template`
- Rename it to `.env`
- Fill out missing values

## Step 3: Start the Metro Server

**Metro** is a JavaScript bundler that ships with React Native.

To start Metro, run the following command from the _root_ of the React Native app:

```bash
npm start
```

## Step 4: Start the App

I think it's better to let Metro Bundler run in its own terminal. Open a _new_ terminal from the _root_ of the React Native project and run the following command to start either or both the _Android_ or _iOS_ app:

```bash
npm run ios
npm run android
```

## Step 5: Modifying the App

Pretty much everything lives in the `/app` directory. Changes should be reflected live in the app simulator.

- `/navigators`: Handles the navigation between different screens. It's common to have multiple navigators to handle different unique flows in the app.
- `/screens`: These are the pages of the app. They're usually passed into different routes in a navigator
- `/components`: Reusable UI elements that have standardized to the apps theming and layout

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

Here are some things I try:

- Reload the app - type `r` in the metro process
- Try git stashing any changes you've made.
  - `git stash` to stash
  - `git stash pop` to unstash
- If pulling in new changes that have added or removed packages or modifying packages
  - Try running `npm install` and / or `npx pod-install ios` in the base directory
- Sometimes the ios or android simulator can get in a weird state and throw errors.
  - Restart the metro process `^c` `npm start`
  - Restart the metro process and clear the cache `^c` `npm start -- --reset-cache`
  - If all else fails, restart your computer ¯\_(ツ)\_/¯

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
