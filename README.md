# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# Updating EventHub for Expo Router

Your project uses file-based routing, so here's exactly what changes from
the plan I gave earlier.

## 1. Delete two files (Expo's tutorial placeholders — not needed)

In VS Code's Explorer, right-click and delete:

- `src/app/index.tsx`
- `src/app/explore.tsx`

(You can leave `src/components/ui/*` alone — those become unused but
harmless. Delete them later if you want a cleaner project.)

## 2. Files you already have from before — no changes needed

- `src/config/firebase.js`
- `src/utils/validation.js`
- `src/context/AuthContext.js`

## 3. Replace these existing files with the new versions in this folder

- `src/app/_layout.tsx` — **overwrite** its content with the new version here
- `src/screens/LoginScreen.js` — **overwrite**
- `src/screens/SignUpScreen.js` — **overwrite**
- `src/screens/ProfileScreen.js` — **overwrite**
- `src/screens/EditProfileScreen.js` — **overwrite**

## 4. Create these brand new files and folders

Right-click `src/app` → New Folder → name it exactly `(auth)` (with the
parentheses). Inside it, create:

- `_layout.tsx`
- `login.tsx`
- `sign-up.tsx`

Right-click `src/app` → New Folder → name it exactly `(main)` (with the
parentheses). Inside it, create:

- `_layout.tsx`
- `index.tsx`
- `edit-profile.tsx`

Copy each file's content from this folder into the matching new file.

## 5. Your final src/app structure should look like this

```
src/app/
├── _layout.tsx
├── (auth)/
│   ├── _layout.tsx
│   ├── login.tsx
│   └── sign-up.tsx
└── (main)/
    ├── _layout.tsx
    ├── index.tsx
    └── edit-profile.tsx
```

## 6. Install Firebase (you may have already done this)

In your terminal, inside the project folder:

```bash
npx expo install firebase @react-native-async-storage/async-storage
```

You do **not** need `@react-navigation/native` or `@react-navigation/native-stack`
— Expo Router already includes routing, so skip that install command from
the earlier instructions.

## 7. Run it

```bash
npx expo start
```

You should land on the login screen. Sign up, and you should be
automatically taken to the Profile screen — no manual navigation code
makes that happen, Expo Router's `Stack.Protected` does it for you based
on whether `user` exists in `AuthContext`.
