# CouponKeeper Mobile App

A React Native mobile application for managing e-commerce coupon codes with advanced features like expiration tracking and automatic detection.

## Features

- **Coupon Management**: Add, view, edit, and delete coupon codes
- **Category Organization**: Organize coupons by store categories
- **Search Functionality**: Search through your coupon collection
- **Expiration Tracking**: Monitor coupons that are expiring soon or already expired
- **Auto-Detection**: Automatically detect coupon codes from other apps (framework ready)
- **Clipboard Integration**: Easy copy-to-clipboard functionality
- **Local Storage**: All data stored locally using AsyncStorage
- **Material Design**: Clean, modern UI using React Native Paper

## Screens

1. **Home Screen**: Main coupon list with search and category filtering
2. **Add Coupon Screen**: Form to add new coupons with validation
3. **Coupon Details Screen**: Detailed view of individual coupons
4. **Expiration Tracker Screen**: Monitor expiring and expired coupons
5. **Settings Screen**: App preferences and data management

## Tech Stack

- **React Native**: Cross-platform mobile development
- **TypeScript**: Type safety and better development experience
- **React Navigation**: Screen navigation
- **React Native Paper**: Material Design components
- **AsyncStorage**: Local data persistence
- **Expo**: Development and build tooling

## Project Structure

```
mobile-app/
├── App.tsx                 # Main app component with navigation
├── index.js               # Entry point
├── package.json           # Dependencies and scripts
├── app.json              # Expo configuration
├── tsconfig.json         # TypeScript configuration
├── types/
│   └── index.ts          # TypeScript type definitions
├── screens/
│   ├── HomeScreen.tsx           # Main coupon list screen
│   ├── AddCouponScreen.tsx      # Add new coupon form
│   ├── CouponDetailsScreen.tsx  # Detailed coupon view
│   ├── ExpirationTrackerScreen.tsx # Expiration monitoring
│   └── SettingsScreen.tsx       # App settings
├── components/
│   └── CouponCard.tsx    # Reusable coupon card component
├── context/
│   └── CouponContext.tsx # Global state management
├── services/
│   ├── CouponService.ts  # Coupon CRUD operations
│   └── ClipboardService.ts # Clipboard utilities
└── assets/               # Images and icons
```

## Setup Instructions

### Prerequisites

1. Node.js (v18 or higher)
2. Expo CLI: `npm install -g @expo/cli`
3. Expo Go app on your mobile device

### Installation

1. Navigate to the mobile app directory:
   ```bash
   cd mobile-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Scan the QR code with Expo Go app on your device

### Building for Production

For Android:
```bash
expo build:android
```

For iOS:
```bash
expo build:ios
```

## Key Features Implementation

### Data Management
- Persistent storage using AsyncStorage
- Type-safe data models with TypeScript
- Automatic expiration date calculations

### User Interface
- Material Design components from React Native Paper
- Responsive layouts for different screen sizes
- Intuitive navigation with stack-based routing

### Coupon Features
- Add coupons with store name, code, description, and expiry date
- Organize by categories (automatically detected or custom)
- Copy coupon codes to clipboard with one tap
- Visual indicators for expiration status

### Smart Notifications
- Automatic tracking of expiring coupons
- Visual alerts for coupons expiring soon
- Easy access to expiration tracker from home screen

## Future Enhancements

The app is designed to support these additional features:

1. **Cloud Sync**: Backup and sync across devices
2. **Push Notifications**: Alerts for expiring coupons
3. **OCR Integration**: Extract coupon codes from images
4. **Barcode Scanning**: Add coupons by scanning barcodes
5. **Social Sharing**: Share coupon codes with friends
6. **Analytics**: Track coupon usage and savings

## Development Notes

- All components are written in TypeScript for better type safety
- The app uses a context-based state management pattern
- Local storage ensures data persists between app sessions
- The auto-detection service is ready for integration with device accessibility features

## Troubleshooting

If you encounter issues:

1. Ensure all dependencies are installed: `npm install`
2. Clear Expo cache: `expo start -c`
3. Restart the Metro bundler
4. Check that your device and computer are on the same network

The mobile app provides a complete coupon management solution with a native mobile experience while maintaining feature parity with the web version.