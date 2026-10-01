# 📱 EcoQuest Mobile App (Capacitor Android Project)

This is a **completely standalone and independent native app version** of EcoQuest, isolated inside `./app`.

Changes made inside this folder **will not affect** the root web application.

---

## ⚡ Capacitor Workflow for Android

The native Android project is already configured and initialized in **[`app/android`](file:///c:/Users/Hp/OneDrive/Desktop/GIT_CLUB/GELplatform/app/android)**!

### 1. Open in Android Studio
To launch the native project in Android Studio:
```bash
cd app
npm run cap:open
```
*(Or open Android Studio and choose **Open an Existing Project** -> navigate to the `GELplatform/app/android` directory).*

### 2. Run Directly on Connected Android Device or Emulator
If you have an Android device connected via USB with USB Debugging enabled, or an emulator running in Android Studio:
```bash
cd app
npm run cap:run
```

### 3. Build Signed or Debug APK in Android Studio
1. Open the project with `npm run cap:open`.
2. In Android Studio's top menu, click **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
3. Once finished, click **Locate** to get your `.apk` file ready to install on any Android phone!

### 4. Syncing UI Changes to Android
Whenever you modify UI, code, or assets in `app/src`:
```bash
cd app
npm run cap:sync
```
This automatically compiles the web assets with `npm run build` and syncs them to `app/android/app/src/main/assets/public`.

---

## 🔄 Live Reload on Android (Development Mode)

If you want live changes on your Android device without syncing every time:
1. Open [`app/capacitor.config.json`](file:///c:/Users/Hp/OneDrive/Desktop/GIT_CLUB/GELplatform/app/capacitor.config.json).
2. Add the `url` property with your computer's local Wi-Fi IP under `server`:
   ```json
   {
     "appId": "com.ecoquest.app",
     "appName": "EcoQuest",
     "webDir": "dist",
     "server": {
       "url": "http://192.168.1.XX:5174",
       "cleartext": true
     }
   }
   ```
3. Run `npm run cap:sync`.
4. Run `npm run dev` in `app/`. Now whenever you edit code, your phone updates live!

---

## 📦 Scripts in `app/`

| Command | Purpose |
|---|---|
| `npm run dev` | Starts the mobile dev server on port 5174 |
| `npm run build` | Builds production bundle to `app/dist` |
| `npm run cap:sync` | Compiles web assets and syncs to Android |
| `npm run cap:open` | Opens `app/android` in Android Studio |
| `npm run cap:run` | Builds and deploys directly to connected Android device |
| `npm test` | Runs the test suite |
