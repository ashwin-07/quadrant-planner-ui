# Quadrant Planner - Frontend Technical Design Document

**Version 1.0** | **Date: January 2025**  
**Frontend Stack: React + TypeScript + Mantine**

---

## Table of Contents

1. [Frontend Architecture Overview](#frontend-architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Component Architecture](#component-architecture)
5. [State Management Strategy](#state-management-strategy)
6. [UI/UX Requirements](#uiux-requirements)
7. [Responsive Design](#responsive-design)
8. [Performance Requirements](#performance-requirements)
9. [Development Standards](#development-standards)
10. [Testing Requirements](#testing-requirements)

---

## Frontend Architecture Overview

### Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React SPA Frontend                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                     Pages                          │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │    │
│  │  │   Landing   │ │ Onboarding  │ │     App     │   │    │
│  │  │    Page     │ │    Flow     │ │  Dashboard  │   │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  Components                        │    │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │    │
│  │ │ Quadrant │ │ Staging  │ │  Goals   │ │Analytics│ │    │
│  │ │   Grid   │ │   Zone   │ │Management│ │Dashboard│ │    │
│  │ └──────────┘ └──────────┘ └──────────┘ └─────────┘ │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              State Management                      │    │
│  │    Zustand + React Query + Context API            │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Core Frontend Principles

- **Component-Based Architecture**: Modular, reusable React components
- **Type Safety**: Full TypeScript coverage for better DX and fewer bugs
- **Responsive Design**: Mobile-first approach with Mantine's responsive utilities
- **Accessibility**: WCAG 2.1 AA compliance with Mantine's built-in a11y features
- **Performance**: Code splitting, lazy loading, and optimized re-renders

---

## Technology Stack

### Core Frontend Technologies
- **React 18+**: Modern React with Concurrent Features and Suspense
- **TypeScript 5+**: Strong typing for enhanced developer experience
- **Vite**: Fast build tool with HMR and optimized production builds

### UI Framework & Design System
- **Mantine 7+**: Comprehensive React UI library providing:
  - 100+ responsive components
  - Built-in dark/light theme system
  - Accessibility features (ARIA, keyboard navigation)
  - Form management with validation
  - Drag & drop functionality
  - Charts and data visualization
  - CSS-in-JS with emotion
- **Tabler Icons**: 4000+ SVG icons with React components
- **Mantine Hooks**: 50+ custom hooks for common patterns

### State Management
- **Zustand**: Lightweight global state management
- **React Query (TanStack Query)**: Server state management and caching
- **React Hook Form**: Performant form state management
- **React Context**: Component-level state sharing

### Development Tools
- **ESLint + Prettier**: Code quality and consistent formatting
- **TypeScript**: Static type checking and IDE support
- **Vitest**: Fast unit testing framework
- **Playwright**: End-to-end testing for critical user flows
- **Husky**: Git hooks for pre-commit quality gates

---

## Project Structure

```
quadrant-planner-ui/
├── public/
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── layout/             # Layout components
│   │   │   ├── AppShell.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Header.tsx
│   │   ├── auth/               # Authentication components
│   │   │   ├── AuthGuard.tsx
│   │   │   ├── LoginButton.tsx
│   │   │   └── ProfileMenu.tsx
│   │   ├── goals/              # Goal management components
│   │   │   ├── GoalCard.tsx
│   │   │   ├── GoalForm.tsx
│   │   │   ├── GoalList.tsx
│   │   │   └── GoalCategoryBadge.tsx
│   │   ├── tasks/              # Task components
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── TaskList.tsx
│   │   │   └── StagingZone.tsx
│   │   ├── quadrants/          # Quadrant system components
│   │   │   ├── QuadrantGrid.tsx
│   │   │   ├── QuadrantSection.tsx
│   │   │   └── DragDropProvider.tsx
│   │   ├── analytics/          # Analytics and charts
│   │   │   ├── QuadrantChart.tsx
│   │   │   ├── GoalProgress.tsx
│   │   │   └── InsightsPanel.tsx
│   │   └── common/             # Shared components
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── EmptyState.tsx
│   ├── pages/                  # Page components
│   │   ├── LandingPage.tsx
│   │   ├── OnboardingFlow.tsx
│   │   ├── Dashboard.tsx
│   │   ├── GoalsPage.tsx
│   │   ├── TasksPage.tsx
│   │   └── AnalyticsPage.tsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useGoals.ts
│   │   ├── useTasks.ts
│   │   ├── useDragDrop.ts
│   │   └── useAnalytics.ts
│   ├── stores/                 # State management
│   │   ├── authStore.ts
│   │   ├── appStore.ts
│   │   └── settingsStore.ts
│   ├── types/                  # TypeScript type definitions
│   │   ├── auth.ts
│   │   ├── goals.ts
│   │   ├── tasks.ts
│   │   └── analytics.ts
│   ├── utils/                  # Utility functions
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── validations.ts
│   ├── App.tsx
│   └── main.tsx
├── tests/                      # Test files
│   ├── components/
│   ├── hooks/
│   └── e2e/
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

---

## Component Architecture

### Component Hierarchy Overview

```
App
├── MantineProvider (theme, notifications)
├── Router
│   ├── LandingPage
│   ├── OnboardingFlow
│   │   ├── WelcomeStep
│   │   ├── QuadrantExplanation
│   │   └── FirstGoalStep
│   └── AppShell (authenticated routes)
│       ├── Header
│       │   ├── Navigation
│       │   └── ProfileMenu
│       ├── Dashboard
│       │   ├── StagingZone
│       │   ├── QuadrantGrid
│       │   │   └── QuadrantSection (x4)
│       │   │       └── TaskCard (multiple)
│       │   └── QuickStats
│       ├── GoalsPage
│       │   ├── GoalList
│       │   └── GoalCard (multiple)
│       └── AnalyticsPage
│           ├── QuadrantChart
│           ├── GoalProgress
│           └── InsightsPanel
```

### Core Component Requirements

#### 1. Layout Components

**AppShell**
- Purpose: Main application layout wrapper using Mantine's AppShell
- Features: Responsive sidebar, header, navigation
- State: Navigation state, user preferences
- Breakpoints: Mobile, tablet, desktop layouts

**Header**
- Purpose: Top navigation and user controls
- Features: Logo, main navigation tabs, profile menu
- Components: Navigation, ProfileMenu
- Mobile: Hamburger menu, responsive navigation

**Navigation**
- Purpose: Tab-based navigation between main sections
- Tabs: Goals, Tasks (default), Analytics
- State: Active tab management
- Visual: Mantine Tabs component with badges for counts

#### 2. Authentication Components

**AuthGuard**
- Purpose: Protect authenticated routes
- Functionality: Redirect to login if not authenticated
- Loading: Show loading state during auth check

**LoginButton**
- Purpose: Google OAuth sign-in
- Design: Prominent CTA button with Google branding
- States: Default, loading, error

**ProfileMenu**
- Purpose: User account management
- Features: User info, logout, settings
- Components: Mantine Menu with user avatar

#### 3. Task Management Components

**StagingZone**
- Purpose: Quick task capture area (5 item max)
- Features: Drag & drop, capacity warnings
- Visual: Dashed border, blue theme, staging icon
- States: Empty, near capacity, at capacity
- Validation: Enforce 5-item limit with gentle prompts

**QuadrantGrid**
- Purpose: 2x2 grid of quadrant sections
- Layout: Mantine Grid with equal columns
- Features: Drag & drop between quadrants
- Responsive: Stack vertically on mobile

**QuadrantSection**
- Purpose: Individual quadrant container
- Features: Color-coded, drag & drop target
- Visual: Distinct colors per quadrant with icons
- Empty States: Helpful guidance messages per quadrant

**TaskCard**
- Purpose: Individual task display and interaction
- Features: Goal badge, completion toggle, drag handle
- Visual: Goal color-coded left border
- Actions: Edit, delete, complete, drag
- States: Normal, dragging, completed

**TaskForm**
- Purpose: Create/edit task modal
- Fields: Title (required), description, goal, due date
- Validation: Mantine form validation
- Features: Goal selection dropdown, date picker

#### 4. Goal Management Components

**GoalList**
- Purpose: Display all user goals
- Layout: Grid layout with goal cards
- Features: Filter by category, add new goal
- Responsive: Adjust columns based on screen size

**GoalCard**
- Purpose: Individual goal display
- Features: Category badge, progress indicator, task count
- Visual: Category color coding
- Actions: Edit, archive, view tasks

**GoalForm**
- Purpose: Create/edit goal modal
- Fields: Title, description, category, timeframe
- Components: Select for category/timeframe
- Validation: Title required, description optional

**GoalCategoryBadge**
- Purpose: Visual category indicator
- Colors: Consistent category color scheme
- Usage: In goal cards, task cards, filters

#### 5. Analytics Components

**QuadrantChart**
- Purpose: Pie chart showing task distribution
- Library: Recharts with Mantine integration
- Features: Highlight Q2 percentage, health indicators
- Interactivity: Hover tooltips, legend

**GoalProgress**
- Purpose: Goal-based task completion tracking
- Visual: Horizontal bar charts per goal
- Metrics: Tasks completed, tasks remaining
- Sorting: By completion percentage

**InsightsPanel**
- Purpose: Actionable insights and recommendations
- Features: Q2 focus alerts, staging efficiency
- Visual: Alert-style messages with icons
- Dynamic: Content based on user patterns

#### 6. Common Components

**LoadingSpinner**
- Purpose: Loading states throughout app
- Component: Mantine Loader with consistent styling
- Usage: Page loads, form submissions, data fetching

**ErrorBoundary**
- Purpose: Catch and display component errors
- Features: Error reporting, graceful fallbacks
- User Experience: Friendly error messages

**EmptyState**
- Purpose: Guidance when sections are empty
- Visual: Illustrations with helpful text
- Actions: CTAs to guide user actions
- Context-aware: Different messages per component

### Component Design Principles

#### Visual Design Standards
- **Color Psychology**: Red (Q1), Green (Q2), Yellow (Q3), Gray (Q4), Blue (Staging)
- **Typography**: Mantine's default font stack with consistent hierarchy
- **Spacing**: Mantine's spacing scale (xs, sm, md, lg, xl)
- **Borders**: Consistent border radius and shadow usage
- **Icons**: Tabler Icons for consistency

#### Interaction Patterns
- **Drag & Drop**: Hello Pangea DnD for smooth interactions
- **Modals**: Mantine modals for forms and confirmations
- **Notifications**: Mantine notifications for feedback
- **Loading States**: Skeleton loaders and spinners
- **Hover Effects**: Subtle transitions for better UX

#### Accessibility Requirements
- **Keyboard Navigation**: All interactive elements accessible
- **Screen Readers**: Proper ARIA labels and roles
- **Color Contrast**: WCAG 2.1 AA compliance
- **Focus Management**: Clear focus indicators
- **Reduced Motion**: Respect user preferences

---

## State Management Strategy

### Architecture Overview

The application uses a multi-layered state management approach combining different tools for different types of state:

**Zustand** - Global Application State
- UI preferences (theme, sidebar state, active tabs)
- User session data 
- Filter states and view preferences
- Local application settings

**React Query** - Server State Management
- Remote data fetching and caching
- Optimistic updates for better UX
- Background refetching and synchronization
- Error handling and retry logic

**React Hook Form** - Form State
- Form validation and submission
- Field-level error handling
- Real-time validation feedback
- Form reset and dirty state tracking

**React Context** - Component Tree State
- Authentication state propagation
- Theme preferences
- Feature flags and environment config

### State Structure Requirements

#### Global App State (Zustand)
```typescript
interface AppState {
  // UI State
  activeTab: 'goals' | 'tasks' | 'analytics'
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'auto'
  
  // Filters & Views
  selectedGoalFilter: string | null
  showCompleted: boolean
  dateRange: { start: Date; end: Date } | null
  
  // Local Cache
  recentlyUsedGoals: string[]
  userPreferences: UserPreferences
}
```

#### Server State (React Query)
- **Goals**: CRUD operations with optimistic updates
- **Tasks**: Real-time sync with conflict resolution
- **Analytics**: Cached with background refresh
- **User Profile**: Periodic updates and sync

#### Form State (React Hook Form)
- **Task Forms**: Creation and editing with validation
- **Goal Forms**: Category and timeframe validation  
- **Settings Forms**: User preference updates
- **Onboarding Forms**: Multi-step form state

### Custom Hooks Strategy

#### Data Hooks
- `useAuth()` - Authentication state and actions
- `useGoals()` - Goal CRUD operations with caching
- `useTasks()` - Task management with real-time updates
- `useAnalytics()` - Analytics data with computed metrics

#### UI Hooks
- `useDragDrop()` - Drag and drop state management
- `useNotifications()` - Toast notifications wrapper
- `useLocalStorage()` - Persistent local state
- `useDebounce()` - Debounced search and filters

### State Persistence Requirements

#### Local Storage
- User UI preferences (theme, layout)
- Filter states and view settings
- Recently used data for quick access
- Onboarding completion status

#### Session Storage
- Form drafts to prevent data loss
- Navigation state for tab restoration
- Temporary UI state during sessions

#### Backend Sync
- User settings and preferences
- Application configuration
- Feature flags and permissions

---

## UI/UX Requirements

### Design System & Theme

#### Mantine Theme Configuration
- **Primary Color**: Blue for staging zone and general UI
- **Quadrant Colors**: 
  - Q1 (Urgent + Important): Red palette
  - Q2 (Important, Not Urgent): Green palette  
  - Q3 (Urgent, Not Important): Yellow palette
  - Q4 (Not Important, Not Urgent): Gray palette
- **Goal Categories**: Distinct color palette for 5 categories
- **Typography**: Mantine's default font stack with clear hierarchy
- **Spacing**: Consistent spacing scale (xs, sm, md, lg, xl)

#### Visual Hierarchy
1. **Staging Zone**: Most prominent with dashed borders and blue theme
2. **Quadrant II**: Second priority with green emphasis
3. **Quadrant I**: High contrast red for urgency
4. **Quadrants III & IV**: Subdued yellow and gray

#### Component Styling Standards
- **Cards**: Consistent shadow, border radius, and padding
- **Buttons**: Rounded corners with hover states
- **Forms**: Floating labels with validation states
- **Icons**: Tabler Icons throughout for consistency
- **Animations**: Subtle transitions, respect reduced motion

### Responsive Design Requirements

#### Breakpoints
- **Mobile**: < 768px (single column layout)
- **Tablet**: 768px - 1024px (adapted quadrant layout)
- **Desktop**: > 1024px (full quadrant grid)

#### Mobile Adaptations
- **Navigation**: Collapsible hamburger menu
- **Quadrants**: Stack vertically with swipe navigation
- **Staging Zone**: Fixed at top with scroll
- **Forms**: Full-screen modals on mobile
- **Drag & Drop**: Touch-friendly with haptic feedback

#### Tablet Adaptations  
- **Quadrants**: 2x2 grid with adjusted spacing
- **Sidebar**: Collapsible with overlay mode
- **Touch Targets**: Minimum 44px for accessibility

### Interaction Patterns

#### Drag & Drop System
- **Library**: Hello Pangea DnD for React 18 compatibility
- **Visual Feedback**: Clear drop zones with hover states
- **Constraints**: Enforce business rules (staging → quadrants require goals)
- **Mobile**: Long press to initiate drag on touch devices
- **Accessibility**: Keyboard navigation alternative

#### Form Interactions
- **Validation**: Real-time with Mantine's form system
- **Auto-save**: Draft saving for long forms
- **Error Handling**: Clear field-level and form-level errors
- **Loading States**: Spinners for submissions

#### Navigation Patterns
- **Tabs**: Persistent main navigation with active states
- **Breadcrumbs**: For deep navigation paths
- **Back Navigation**: Browser back button support
- **Modal Navigation**: Clear entry/exit paths

### Accessibility Standards

#### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 for text
- **Keyboard Navigation**: All functionality accessible via keyboard
- **Screen Readers**: Proper ARIA labels and roles
- **Focus Management**: Clear focus indicators and logical order

#### Specific Requirements
- **Alt Text**: All icons and images
- **Form Labels**: Properly associated with form fields
- **Skip Links**: For main content navigation
- **Color Independence**: Information not conveyed by color alone
- **Reduced Motion**: Respect user motion preferences

---

## Responsive Design

### Breakpoint Strategy

#### Mobile-First Approach
- Design for mobile screens first (320px minimum)
- Progressive enhancement for larger screens
- Touch-friendly interactions and target sizes
- Simplified navigation and reduced cognitive load

#### Responsive Layout Patterns

**Mobile (< 768px)**
- Single column layout
- Quadrants stack vertically
- Full-width staging zone at top
- Tab navigation in header
- Bottom action buttons for quick access

**Tablet (768px - 1024px)**  
- 2x2 quadrant grid with adjusted spacing
- Collapsible sidebar for filters
- Modal overlays for forms
- Drag & drop with touch optimization

**Desktop (> 1024px)**
- Full quadrant grid layout
- Persistent sidebar with filters
- Inline forms and quick actions
- Hover states and desktop interactions

### Component Responsiveness

#### QuadrantGrid
- **Desktop**: 2x2 grid with equal heights
- **Tablet**: 2x2 grid with adjusted gaps
- **Mobile**: Vertical stack with swipe navigation

#### StagingZone
- **Desktop**: Horizontal layout with drag handles
- **Tablet**: Compact list with touch targets
- **Mobile**: Full-width with touch-optimized cards

#### Navigation
- **Desktop**: Horizontal tabs with labels
- **Tablet**: Horizontal tabs with icons+labels
- **Mobile**: Bottom navigation or hamburger menu

#### Forms
- **Desktop**: Modal dialogs with side-by-side fields
- **Tablet**: Modal dialogs with stacked fields
- **Mobile**: Full-screen forms with step navigation

---

## Performance Requirements

### Frontend Performance Standards

#### Core Web Vitals Targets
- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100 milliseconds  
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3 seconds

#### Bundle Size Targets
- **Initial Bundle**: < 200KB gzipped
- **Total JavaScript**: < 1MB gzipped
- **Vendor Chunks**: < 500KB gzipped
- **Critical CSS**: < 50KB

### Optimization Strategies

#### Code Splitting
- **Route-based**: Lazy load pages (Landing, Dashboard, Analytics)
- **Component-based**: Dynamic imports for heavy components
- **Vendor**: Separate chunks for React, Mantine, third-party libraries
- **Critical Path**: Inline critical CSS and defer non-critical resources

#### React Optimizations
- **React.memo**: Memoize expensive components (TaskCard, QuadrantSection)
- **useMemo**: Cache expensive calculations (filtered tasks, analytics)
- **useCallback**: Stable function references for event handlers
- **Virtualization**: For lists with >100 items

#### Data Loading
- **Optimistic Updates**: Immediate UI feedback for user actions
- **Background Sync**: Refetch data when window regains focus
- **Pagination**: Load tasks in chunks of 50-100 items
- **Debouncing**: 300ms delay for search and filters

#### Asset Optimization
- **Image Optimization**: WebP format with fallbacks
- **Icon Strategy**: SVG sprites for frequently used icons
- **Font Loading**: Preload critical fonts, swap for system fonts
- **Service Worker**: Cache static assets and API responses

### Performance Monitoring

#### Metrics to Track
- **Component Render Times**: Development warnings for >16ms renders
- **Bundle Analysis**: Regular bundle size reporting
- **Memory Usage**: Detect memory leaks in long-running sessions
- **Network Requests**: Monitor API response times

#### Performance Budget
- **JavaScript Budget**: 200KB initial, 1MB total
- **Image Budget**: 500KB per page
- **Font Budget**: 100KB maximum
- **Third-party Budget**: 100KB maximum

---

## Development Standards

### Code Quality Standards

#### TypeScript Configuration
- **Strict Mode**: Enable all strict type checking options
- **Path Mapping**: Use absolute imports with `@/` prefix
- **Type Coverage**: Minimum 95% type coverage
- **No Any**: Prohibit `any` types in production code

#### ESLint Rules
- **React Hooks**: Enforce hooks rules and dependencies
- **Accessibility**: Include jsx-a11y rules for accessibility
- **Import Organization**: Consistent import ordering and grouping
- **Unused Variables**: Error on unused variables and imports

#### Prettier Configuration
- **Single Quotes**: Use single quotes for strings
- **Semicolons**: Always include semicolons
- **Trailing Commas**: ES5 trailing commas
- **Tab Width**: 2 spaces for indentation

#### Component Standards
- **Functional Components**: Use function declarations over arrows
- **Props Interface**: Define TypeScript interfaces for all props
- **Default Props**: Use default parameters instead of defaultProps
- **Component Files**: One component per file with matching names

### Development Workflow

#### Environment Setup Requirements
- **Node.js**: Version 18+ for optimal Vite performance
- **Package Manager**: npm or yarn with lock file committed
- **IDE**: VSCode with recommended extensions
- **Git Hooks**: Pre-commit hooks for linting and type checking

#### Branch Strategy
- **Feature Branches**: Create branches from main for new features
- **Naming Convention**: `feature/task-management` or `fix/staging-zone-bug`
- **Pull Requests**: Required for all changes to main branch
- **Code Review**: Minimum one reviewer for all PRs

#### Testing Requirements
- **Unit Tests**: 80%+ code coverage for utility functions
- **Component Tests**: Test user interactions and edge cases
- **Integration Tests**: Test component integration and data flow
- **E2E Tests**: Cover critical user journeys

### Build and Deploy Process

#### Development Build
- **Hot Module Replacement**: Instant updates during development
- **Source Maps**: Detailed source maps for debugging
- **Type Checking**: Real-time TypeScript error reporting
- **Linting**: Immediate feedback on code quality issues

#### Production Build
- **Tree Shaking**: Remove unused code from bundles
- **Minification**: Minimize JavaScript and CSS
- **Code Splitting**: Separate vendor and application code
- **Asset Optimization**: Compress images and fonts

#### Environment Variables
- **Development**: Local development configuration
- **Staging**: Testing environment with production-like data
- **Production**: Live environment with real user data
- **Feature Flags**: Control feature rollout and A/B testing

---

## Testing Requirements

### Testing Strategy Overview

#### Testing Pyramid Structure
- **Unit Tests (70%)**: Individual component and utility function testing
- **Integration Tests (20%)**: Component interaction and data flow testing  
- **E2E Tests (10%)**: Critical user journey testing

#### Testing Libraries
- **Vitest**: Fast unit testing framework with hot reload
- **React Testing Library**: Component testing with user-centric approach
- **Playwright**: Cross-browser end-to-end testing
- **MSW**: API mocking for consistent test environments

### Unit Testing Requirements

#### Component Testing
- **Render Testing**: Verify components render without errors
- **Props Testing**: Test component behavior with different props
- **User Interaction**: Test clicks, form submissions, drag & drop
- **State Changes**: Verify component state updates correctly

#### Hook Testing
- **Custom Hooks**: Test hook logic and return values
- **State Management**: Test Zustand store actions and selectors
- **Side Effects**: Test API calls and async operations
- **Error Handling**: Test error states and recovery

#### Coverage Requirements
- **Statements**: Minimum 80% coverage
- **Branches**: Minimum 75% coverage
- **Functions**: Minimum 80% coverage
- **Lines**: Minimum 80% coverage

### Integration Testing

#### Component Integration
- **Parent-Child**: Test prop passing and callback handling
- **Context Usage**: Test context providers and consumers
- **State Synchronization**: Test shared state between components
- **Event Handling**: Test event bubbling and handling

#### Feature Testing
- **Task Flow**: Create → Stage → Organize → Complete workflow
- **Goal Management**: CRUD operations with UI updates
- **Drag & Drop**: Cross-quadrant task movement
- **Filtering**: Goal-based task filtering and search

### E2E Testing Strategy

#### Critical User Journeys
- **Authentication**: Google OAuth login/logout flow
- **Onboarding**: New user guided setup process
- **Task Management**: Full task lifecycle from creation to completion
- **Goal Creation**: Add goals and assign tasks

#### Cross-Browser Testing
- **Chrome**: Primary testing browser
- **Firefox**: Secondary testing browser  
- **Safari**: macOS and iOS testing
- **Edge**: Windows testing

#### Device Testing
- **Desktop**: 1920x1080 and 1366x768 resolutions
- **Tablet**: iPad and Android tablet sizes
- **Mobile**: iPhone and Android phone sizes

### Testing Data Management

#### Test Data Strategy
- **Fixtures**: Reusable test data objects
- **Factories**: Generate test data with variations
- **Mocking**: Mock external dependencies and APIs
- **Cleanup**: Reset state between tests

#### Mock Requirements
- **API Responses**: Mock Supabase client responses
- **Authentication**: Mock user authentication state
- **Date/Time**: Mock date functions for consistent testing
- **External Services**: Mock third-party integrations

---

## Conclusion

This frontend technical design document provides a comprehensive foundation for building the Quadrant Planner application with modern React, TypeScript, and Mantine. The design emphasizes:

### Key Technical Strengths
- **Component Architecture**: Modular, reusable components with clear responsibilities
- **State Management**: Multi-layered approach using appropriate tools for different state types
- **Performance**: Optimized for Core Web Vitals with code splitting and memoization
- **Accessibility**: WCAG 2.1 AA compliance with Mantine's built-in accessibility features
- **Responsive Design**: Mobile-first approach with progressive enhancement

### Developer Experience
- **TypeScript**: Full type safety with strict configuration
- **Testing**: Comprehensive testing strategy with high coverage requirements
- **Code Quality**: ESLint and Prettier for consistent code standards
- **Development Workflow**: Efficient development process with hot reload and instant feedback

### User Experience Focus
- **Visual Design**: Philosophy-driven color system and clear visual hierarchy
- **Interaction Design**: Intuitive drag & drop with appropriate feedback
- **Performance**: Fast loading and responsive interactions
- **Accessibility**: Inclusive design for all users

This design provides a solid foundation for implementing the Quadrant Planner application while maintaining high standards for code quality, performance, and user experience.
