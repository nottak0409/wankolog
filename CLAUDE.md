# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

「わんこログ」is a Japanese dog health tracking mobile application built with React Native and Expo. It allows dog owners to record and manage their pets' health status, medical history, vaccinations, daily activities, and more.

## Development Commands

### Development
- `npm start` - Start Expo development server
- `npm run android` - Start on Android device/emulator
- `npm run ios` - Start on iOS device/simulator  
- `npm run web` - Start web version

### Testing & Quality
- `npm test` - Run Jest tests with watch mode
- `npm run lint` - Run Expo linter
- `npm run type-check` - Run TypeScript type checking
- `npm run type-check:watch` - Run TypeScript type checking in watch mode
- `npm run lint:ts` - Run TypeScript check + linter
- `npm run validate` - Run full validation (type-check + lint + test)

### Project Management
- `npm run reset-project` - Reset project to clean state (removes example code)

## Claude Code Automation Settings

**IMPORTANT**: The following commands and operations are pre-approved for automatic execution without asking for permission:

### File Operations
- **Read**: Any file within the project directory
- **Write/Edit**: Any file within the project directory
- **Create**: New files as needed for the project

### Command Execution
- **All npm commands**: Including but not limited to:
  - Development servers (npm start, npm run ios, npm run android, npm run web)
  - Testing commands (npm test, npm run test:watch, npm run test:coverage)  
  - Quality checks (npm run lint, npm run type-check, npm run validate)
  - Build and deployment commands
  - Any other npm run scripts defined in package.json
- **npx commands**: For Expo and other project tools (e.g., npx expo prebuild, npx expo run:android)
- **Build commands**: ./gradlew commands for Android builds
- **Git commands**: For version control operations within the project

This allows for efficient development workflow without interruption.

## Architecture

### App Structure
- **Expo Router**: File-based routing with tabs layout
- **Navigation**: Bottom tab navigation with 5 main screens (Home, Calendar, History, Pet Profile, Settings)
- **UI Framework**: React Native Paper for components + custom theming
- **State Management**: Currently using local state (no global state management implemented yet)

### Key Directories
- `app/(tabs)/` - Main tab screens (index, calendar, history, pet-profile, settings)
- `app/components/molecules/` - Reusable component library
- `app/types/` - TypeScript type definitions
- `app/screens/` - Screen components
- `app/constants/` - Theme and styling constants

### Database Schema
PostgreSQL schema is defined in `database_schema.sql` with the following main entities:
- `users` - User accounts
- `pets` - Pet profiles with basic info
- `daily_records` - Daily activities (meal, poop, exercise)
- `medical_records` - Medical visits and treatments
- `vaccine_records` - Vaccination tracking
- `notification_settings` - Notification preferences

### Type System
TypeScript types are organized by domain:
- `types/profile.ts` - Pet profile and form data types
- `types/record.ts` - Daily record types
- `types/medical.ts` - Medical and vaccine record types
- `types/calendar.ts` - Calendar-related types
- `types/notification.ts` - Notification types

### Theming
Custom theme system in `app/constants/theme.ts` with:
- Color palette for light/dark modes
- Typography scales
- Shadow definitions
- Spacing system

### Key Features Architecture
- **Pet Profile Management**: Form-based editing with image picker integration
- **Daily Records**: Time-based logging of meals, bathroom breaks, exercise
- **Medical History**: Comprehensive tracking of vet visits, treatments, medications
- **Vaccination Tracking**: Scheduled reminders and history
- **Calendar View**: Monthly/daily view of all recorded activities

## Development Notes

- Uses React Native Paper for consistent Material Design components
- Implements Expo Router for navigation (file-based routing)
- TypeScript throughout with strict typing
- Japanese UI text and content
- No backend implementation yet (planned: Firebase/Supabase)
- No global state management yet (considering Zustand/Jotai)

## Monetization Implementation Design (TODO)

### Technical Architecture for Freemium + Ads Model

#### Subscription Management
- **Payment Provider**: RevenueCat (cross-platform subscription management)
- **Stores**: iOS App Store / Google Play Store in-app purchases
- **Subscription tiers**: 
  - Free (with ads, limited features)
  - Premium Monthly (¥300-500)
  - Premium Yearly (¥3,000-5,000 with discount)

#### Ad Implementation
- **Ad Provider**: Google AdMob
- **Ad Types**:
  - Banner ads (bottom of home screen)
  - Native ads (in list views)
- **Implementation Libraries**:
  - `react-native-google-mobile-ads`
  - Ad placement configuration in `app/config/ads.ts`

#### Feature Gating Implementation
```typescript
// app/services/subscription.ts
interface SubscriptionStatus {
  isPremium: boolean;
  expiresAt?: Date;
  tier: 'free' | 'premium_monthly' | 'premium_yearly';
}

// Feature checks throughout the app:
// - Pet limit check in pet creation flow
// - Data retention limit in record queries
// - Ad visibility toggle based on subscription
// - Export functionality availability
```

#### Database Considerations
- Add `subscription_status` table to track user subscriptions
- Add `subscription_tier` field to users table
- Implement data retention policies (30 days for free users)
- Add indexes for efficient querying with date filters

#### Key Implementation Tasks
1. Integrate RevenueCat SDK for subscription management
2. Set up AdMob account and configure ad units
3. Implement feature flags system for premium features
4. Add subscription management UI in settings
5. Implement data retention policies and cleanup jobs
6. Add analytics to track conversion rates
7. Implement receipt validation on backend
8. Add restore purchases functionality
9. Create upgrade prompts at appropriate touchpoints
10. Implement graceful degradation for expired subscriptions