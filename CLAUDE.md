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

**IMPORTANT**: All npm run commands are pre-approved for automatic execution. Claude Code should run any npm commands without asking for permission first, including:
- Development servers (npm start, npm run ios, npm run android, npm run web)
- Testing commands (npm test, npm run test:watch, npm run test:coverage)
- Quality checks (npm run lint, npm run type-check, npm run validate)
- Build and deployment commands
- Any other npm run scripts defined in package.json

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