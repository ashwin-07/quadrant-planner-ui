# 🎯 Quadrant Planner

**Philosophy-driven productivity with Stephen Covey's Time Management Matrix**

A modern web application that transforms task management from reactive completion to intentional time investment, helping users build lives of significance rather than just efficiency.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Mantine](https://img.shields.io/badge/Mantine-228BE6?style=for-the-badge&logo=mantine&logoColor=white)](https://mantine.dev/)

## 📖 Philosophy

Based on Stephen Covey's "7 Habits of Highly Effective People", Quadrant Planner implements the Time Management Matrix:

- **Q1 (Urgent + Important)**: Handle crises and urgent deadlines
- **Q2 (Important, Not Urgent)**: Your most important work - schedule time for these
- **Q3 (Urgent, Not Important)**: Delegate or find ways to automate
- **Q4 (Not Important, Not Urgent)**: Question whether these are necessary
- **Staging Zone**: Quick capture before organizing into quadrants

## ✨ Features

### 🎯 **Quadrant-Based Task Management**

- Visual 2x2 matrix with staging zone
- Color-coded quadrants with meaningful icons
- Drag-and-drop task organization
- Q2 focus emphasis for long-term success

### 🎯 **Goal-Driven Organization**

- 6 life categories: Career, Health, Relationships, Learning, Financial, Personal
- Tasks connect to meaningful outcomes
- Goal progress tracking and visualization
- Maximum 12 active goals to prevent overcommitment

### 📦 **Staging Zone System**

- Quick task capture with 5-item limit
- Gentle processing prompts and notifications
- Prevents overwhelming flat task lists
- Encourages regular organization habits

### 📊 **Analytics & Insights**

- Quadrant distribution with Q2 emphasis
- Staging zone efficiency metrics
- Goal progress tracking and balance analysis
- Productivity trends and recommendations

### 🎨 **Modern UI/UX**

- Custom Mantine theme with philosophy-driven colors
- Responsive design (mobile-first)
- Accessibility compliant (WCAG 2.1 AA)
- Dark/light theme support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/quadrant-planner-ui.git
cd quadrant-planner-ui

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format with Prettier
npm run format:check    # Check Prettier formatting
npm run type-check      # Run TypeScript checks
npm run quality         # Run all quality checks

# Testing
npm run test            # Run tests in watch mode
npm run test:run        # Run tests once
npm run test:coverage   # Run tests with coverage

# Git Hooks
npm run prepare         # Set up Husky git hooks
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── common/         # Reusable UI components
│   ├── goals/          # Goal management components
│   ├── tasks/          # Task management components
│   ├── quadrants/      # Quadrant display components
│   ├── analytics/      # Analytics and insights
│   ├── onboarding/     # User onboarding flow
│   └── layout/         # Layout and navigation
├── hooks/              # Custom React hooks
├── stores/             # State management (Zustand)
├── pages/              # Page components
├── services/           # API and external services
├── utils/              # Utility functions
│   ├── api.ts         # API utilities
│   ├── date.ts        # Date manipulation
│   ├── task.ts        # Task-specific utilities
│   ├── validation.ts  # Form validation
│   └── constants.ts   # App constants
├── types/              # TypeScript type definitions
├── theme/              # Mantine theme configuration
├── assets/             # Static assets
└── lib/                # Third-party library configurations
```

## 🎨 Design System

### Color Philosophy

Our color system supports the productivity philosophy:

- **Q1 Red**: Urgency and fire (handle crises)
- **Q2 Green**: Growth and success (most important work)
- **Q3 Yellow**: Caution and delegation
- **Q4 Gray**: Elimination and minimal priority
- **Staging Blue**: Temporary processing state

### Component Architecture

- **Atomic Design**: Components built from atoms → molecules → organisms
- **TypeScript**: Fully typed with strict mode enabled
- **Mantine**: Comprehensive UI framework with custom theming
- **Responsive**: Mobile-first design with consistent spacing

## 🔧 Development

### Code Quality Standards

- **TypeScript**: Strict mode with comprehensive type coverage
- **ESLint**: Extended with React, accessibility, and TypeScript rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality enforcement
- **Testing**: Vitest + React Testing Library

### Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes with atomic commits
3. Pre-commit hooks run automatically (type check, lint, format)
4. Push and create pull request
5. Code review and merge

### Environment Variables

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Quadrant Planner
VITE_APP_VERSION=1.0.0
```

## 🧪 Testing Strategy

- **Unit Tests**: Functions and utilities with Jest/Vitest
- **Component Tests**: React components with Testing Library
- **Integration Tests**: User workflows and API integration
- **E2E Tests**: Critical user paths (planned for Phase 2)

### Test Coverage Goals

- Utilities: 90%+ coverage
- Components: 80%+ coverage
- Integration: All critical paths
- Types: 100% TypeScript coverage

## 📈 Performance

### Optimization Strategies

- **Code Splitting**: Lazy loading with React.lazy()
- **Bundle Analysis**: Webpack Bundle Analyzer integration
- **Memoization**: React.memo and useMemo for expensive operations
- **Virtualization**: Large lists with react-window
- **Image Optimization**: WebP format with fallbacks

### Performance Targets

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.0s
- **Cumulative Layout Shift**: < 0.1

## 🌍 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Docker

```bash
# Build image
docker build -t quadrant-planner .

# Run container
docker run -p 3000:3000 quadrant-planner
```

### Static Hosting

```bash
# Build for static hosting
npm run build

# Deploy dist/ folder to any static host
# (Netlify, GitHub Pages, AWS S3, etc.)
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes with tests
4. **Ensure** quality checks pass
5. **Submit** a pull request

### Development Guidelines

- Follow the established code style
- Write tests for new features
- Update documentation as needed
- Keep commits atomic and descriptive
- Use conventional commit messages

## 📋 Roadmap

### Phase 1: Foundation ✅

- Project setup and tooling
- Custom theme and component system
- Basic authentication (mock)
- Core task and goal management

### Phase 2: Core Features (In Progress)

- Drag & drop functionality
- Analytics dashboard
- User onboarding flow
- Mobile responsive design

### Phase 3: Advanced Features

- Real-time collaboration
- Advanced analytics
- Calendar integration
- Notification system

### Phase 4: Scaling

- Performance optimization
- Accessibility enhancements
- Internationalization
- Mobile app consideration

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Stephen Covey** - For the foundational Time Management Matrix philosophy
- **Cal Newport** - For Deep Work principles that inspired Q2 focus
- **Mantine Team** - For the excellent React UI framework
- **Vite Team** - For the lightning-fast build tool

---

**Built with ❤️ by developers who believe in intentional productivity**

For questions, suggestions, or contributions, please [open an issue](https://github.com/your-username/quadrant-planner-ui/issues) or reach out to the team.
