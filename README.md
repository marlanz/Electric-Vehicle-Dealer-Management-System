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

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

direction structure
app/
  (auth)/auth.tsx
  (dealer)/
    (tabs)/
      index.tsx              // Dashboard staff
      vehicles.tsx           // List vehicles
      quotations.tsx         // List quotations
      orders.tsx             // List orders
      profile.tsx
      customers.tsx
      _layout.tsx
    customers/
      create.tsx
    orders/
      create.tsx
    promotions/
      index.tsx
      [id].tsx
    quotations/
      create.tsx
      [id].tsx
    orders/
      create.tsx
      [id].tsx
    (vehicles)/
      [id].tsx               // Detail (đã có)
    _layout.tsx
    temp-selection.tsx
  (dealer-manager)/
    index.tsx
    staffs/
      index.tsx
      create.tsx
      [id].tsx
    inventory/
      index.tsx
      create.tsx
      [id].tsx
    purchase-orders/
      index.tsx
      create.tsx
      [id].tsx
    oem-contracts/
      create.tsx
      [id].tsx
  (shared)/
    notifications.tsx
    search.tsx
  (evm)/
    (tabs)/
      _layout.tsx
      ....
  (shared)
    testdrives.tsx
  _layout.tsx
  global.css
  index.tsx
src/
  components
  ...
