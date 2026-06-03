<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Make Habityn the file name

```md
# Habityn PRD

## Product name
**Habityn** — a modern, responsive habit tracker that helps everyday users build and maintain routines with minimal effort and clear progress visibility.

## Problem statement
Many people want to build better habits, but current tools are often too complex, too noisy, or too hard to keep using consistently. The product should make habit tracking feel simple, motivating, and fast for users with average technical background.

## Target user profile
- Adults and teens who want to build personal routines for health, productivity, learning, or wellness.
- Users with average technical confidence who prefer a clean, straightforward interface.
- Mobile-first users who want quick daily check-ins and simple progress visibility.

## Core features

### 1. Account and onboarding
Users can create an account, sign in, and complete a short onboarding flow to start tracking habits quickly. A lightweight setup reduces friction and helps new users reach the first success state faster.

**User stories**
- As a user, I want to sign up with email so I can save my habits across devices.
- As a user, I want to sign in securely so I can access my habit data anytime.
- As a user, I want a short onboarding flow so I can start using the app without confusion.

### 2. Habit creation and management
Users can create, edit, pause, archive, and delete habits. Each habit should support a name, category, schedule, reminder time, and target frequency.

**User stories**
- As a user, I want to create a habit in a few steps so I can begin tracking quickly.
- As a user, I want to edit a habit so I can update my goals when my routine changes.
- As a user, I want to archive or delete a habit so my dashboard stays relevant.

### 3. Daily check-in tracking
Users can mark habits as done for the day with one tap and see today’s completion status at a glance. The interface should minimize taps and make the active state obvious.

**User stories**
- As a user, I want to check off a habit quickly so I can complete my daily review in seconds.
- As a user, I want to see which habits are incomplete today so I know what still needs attention.
- As a user, I want clear active and inactive states so I can use the app without mistakes.

### 4. Reminders and notifications
Users can turn reminders on or off and choose reminder time and frequency per habit. Notifications should support simple scheduling and help users stay consistent without being intrusive.

**User stories**
- As a user, I want reminders for important habits so I do not forget them.
- As a user, I want to choose reminder times so notifications fit my routine.
- As a user, I want to disable reminders for some habits so I stay in control.

### 5. Progress and insights
Users can view progress by day, week, and month, including streaks, completion rate, and trend charts. The dashboard should make progress easy to understand without requiring analysis skills.

**User stories**
- As a user, I want to see weekly and monthly progress so I can understand my consistency over time.
- As a user, I want streak tracking so I feel motivated to keep going.
- As a user, I want simple charts so I can quickly understand whether I am improving.

### 6. Categories and filtering
Users can organize habits into categories such as health, learning, productivity, and personal care. They can filter habits by category to reduce clutter and focus on a specific goal area.

**User stories**
- As a user, I want to categorize habits so I can group similar goals together.
- As a user, I want to filter by category so I can focus on one part of my routine.
- As a user, I want category labels on the dashboard so I can scan my habits faster.

### 7. Visual design and UX
The app should use a clean, modern, mobile-first layout with clear typography, strong contrast, simple navigation, and smooth interactions. The UI should keep cognitive load low and make key actions obvious.

**User stories**
- As a user, I want a clean interface so I can focus on my habits instead of the app.
- As a user, I want obvious navigation so I can move around the app easily.
- As a user, I want responsive layouts so the app works well on phone, tablet, and desktop.

## Explicitly out of scope
- Social features such as friends, sharing, competitions, or accountability groups.
- Gamification beyond basic streaks and completion metrics, such as badges, levels, or rewards stores.
- Payments, subscriptions, premium plans, or ads.
- Mood tracking, journaling, or deep personal analytics.
- Integration with wearable devices, calendars, smart home devices, or third-party automation tools.
- Complex task management or full to-do list replacement.

## Tech stack
- Frontend: React with TypeScript for a responsive component-based UI.
- Styling: Tailwind CSS or a comparable utility-first system for fast, consistent UI implementation.
- State management: React Query plus local state, or Redux Toolkit if the app grows.
- Backend: Node.js with Express.js for API handling and app logic.
- Database: MongoDB for habit records, users, reminders, and progress history.
- Authentication: JWT-based auth with secure password hashing.
- Notifications: Push notification service plus scheduled jobs for reminders.
- Hosting: Vercel for the frontend and Render or similar for the backend.

## Definition of done
- Users can sign up, sign in, and manage their account successfully.
- Users can create, edit, archive, and delete habits without errors.
- Users can mark habits complete and see today’s status instantly.
- Reminder settings work reliably and notifications are delivered on schedule.
- Dashboard shows daily, weekly, and monthly progress with accurate streaks and completion metrics.
- UI is responsive across common mobile and desktop breakpoints.
- Empty, loading, success, and error states are implemented for all major flows.
- Core flows are tested and pass acceptance criteria for usability, data integrity, and performance.
```

