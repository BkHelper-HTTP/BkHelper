# 📱 BkHelper

BkHelper is a **mobile application** built with **React Native + Expo** to help students at Bách Khoa University quickly search for **courses, schedules, classrooms, and lecturers**.

## 🚀 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)
- **Navigation**: [Expo Router](https://expo.github.io/router) + [React Navigation](https://reactnavigation.org/)
- **State & Form**: [Formik](https://formik.org/)
- **Networking**: [Axios](https://axios-http.com/)
- **UI/UX**:
  - `@expo/vector-icons` – Icon pack
  - `expo-linear-gradient`, `expo-blur` – UI effects
  - `react-native-root-toast` – Toast notification
- **Animation**: `react-native-reanimated`, `react-native-gesture-handler`
- **Storage**: `@react-native-async-storage/async-storage`
- **Web Support**: `react-native-web`, `react-native-webview`

## 📂 Project Structure

```
src/
├── app/            # Screens + layout (using expo-router)
├── assets/         # Images, fonts, icons
├── components/     # Reusable UI components
├── constants/      # Colors, config, enums
├── context/        # React Context (Auth, Theme...)
├── hooks/          # Custom hooks (useAuth, useTheme...)
├── scripts/        # Utility scripts (reset project...)
├── services/       # API calls, Axios instance, service layer
├── types/          # TypeScript types & interfaces
└── utils/          # Helpers, format date, logger...
```

## 🛠️ Installation & Run

### 1️⃣ Prerequisites
- [Node.js >= 18](https://nodejs.org)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### 2️⃣ Clone the project
```bash
git clone https://github.com/thinhnguyen07022004/BkHelper.git
cd BkHelper
```

### 3️⃣ Install dependencies
```bash
npm install
# or yarn install
```

### 4️⃣ Start the app
```bash
npm run start
# Open Expo Go app on your phone and scan the QR code
```

Run on specific platforms:
```bash
npm run android   # Run on Android emulator or physical device
npm run ios       # Run on iOS simulator (macOS)
npm run web       # Run in browser
```

### 5️⃣ Reset project (if needed)
```bash
npm run reset-project
```

## 📚 Available Scripts

| Command                | Description                      |
|----------------------|----------------------------------|
| `npm start`          | Start the Expo project           |
| `npm run android`    | Run on Android                   |
| `npm run ios`        | Run on iOS                       |
| `npm run web`        | Run on Web                       |
| `npm run reset-project` | Clean cache & node_modules     |

## 📦 Main Dependencies

| Category          | Libraries |
|------------------|-----------|
| **UI/UX**        | `@expo/vector-icons`, `expo-linear-gradient`, `expo-blur`, `expo-font`, `expo-haptics`, `expo-image`, `react-native-root-toast` |
| **Navigation**   | `expo-router`, `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`, `@react-navigation/elements` |
| **Networking**   | `axios` |
| **State & Form** | `formik`, `@react-native-async-storage/async-storage` |
| **Animation**    | `react-native-reanimated`, `react-native-gesture-handler` |
| **System**       | `expo-constants`, `expo-splash-screen`, `expo-status-bar`, `expo-linking`, `expo-system-ui`, `expo-web-browser` |
| **Web Support**  | `react-native-web`, `react-native-webview` |

## 🤝 Contributing

Contributions are welcome!  
- Fork the repo  
- Create a branch (`git checkout -b feature/my-feature`)  
- Commit your changes (`git commit -m 'Add feature'`)  
- Push the branch (`git push origin feature/my-feature`)  
- Open a Pull Request

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

👨‍💻 **Author**: [Thinh Nguyen](https://github.com/thinhnguyen07022004)
