## CI/CD Status

[![CI/CD](https://github.com/[your-username]/quiznation/actions/workflows/ci.yml/badge.svg)](https://github.com/[your-username]/quiznation/actions/workflows/ci.yml)

## Features

- User Authentication (Register/Login)
- JWT-based Authorization
- MongoDB Integration
- Redux State Management
- Form Validation with Zod
- Responsive Design with Tailwind CSS
- Animated UI Components

## Tech Stack

- **Frontend**: Next.js, TypeScript, Redux-Toolkit, Redux-Saga
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Form Handling**: React Hook Form, Zod
- **Authentication**: JWT, bcrypt

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas account)

## Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/quiznation.git
cd quiznation
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup**

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string
# Example: mongodb+srv://username:password@cluster.mongodb.net/quiznation

# JWT Secret
JWT_SECRET=your_jwt_secret_key
# Example: mysupersecretkey123

# Application
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

4. **Run the development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
quiznation/
├── public/              # Static files
├── src/
│   ├── backend/         # Backend logic
│   │   ├── models/      # MongoDB models
│   │   └── services/    # Business logic
│   ├── lib/            # Shared utilities
│   │   ├── validations/ # Zod schemas
│   │   └── dbConnect.ts # Database connection
│   ├── pages/          # Next.js pages
│   │   ├── api/        # API routes
│   │   └── ...         # Frontend pages
│   ├── store/          # Redux store
│   │   ├── slices/     # Redux slices
│   │   └── sagas/      # Redux sagas
│   ├── ui/             # Reusable UI components
│   └── styles/         # Global styles
├── .env.local          # Environment variables
└── ...                 # Config files
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript checks

## Environment Variables

| Variable            | Description               | Example                                                |
| ------------------- | ------------------------- | ------------------------------------------------------ |
| MONGODB_URI         | MongoDB connection string | mongodb+srv://user:pass@cluster.mongodb.net/quiznation |
| JWT_SECRET          | Secret key for JWT tokens | mysupersecretkey123                                    |
| NEXT_PUBLIC_API_URL | API base URL              | http://localhost:3000                                  |
| NODE_ENV            | Environment mode          | development                                            |

## Testing

This project uses Playwright for end-to-end testing. The tests cover critical user flows including authentication and quiz functionality.

### Running Tests

```bash
# Run all tests
npm run test:e2e

# Run tests with UI mode
npm run test:e2e:ui

# Debug tests
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

### Test Structure

- `tests/auth.spec.ts`: Authentication flow tests
- `tests/helpers/`: Test helper functions and utilities

### Writing Tests

Tests are written using Playwright's test runner. Example:

```typescript
test('should login successfully', async ({ page }) => {
  await page.goto('/signin');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL('/dashboard');
});

## Git Hooks

This project uses Husky for Git hooks to ensure code quality:

### Pre-commit Hook
- Runs ESLint
- Runs Prettier
- Runs TypeScript type checking
- Only staged files are checked

### Commit Message Hook
Enforces conventional commit messages:
- Format: `type(scope): subject`
- Types: build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test
- Example: `feat(auth): add login functionality`

### Installation
Git hooks are automatically installed when you run `npm install`.

## CI/CD Pipeline

Our CI/CD pipeline uses GitHub Actions and includes:

1. **Automated Testing**
   - End-to-end tests with Playwright
   - Runs on every push and pull request

2. **Code Quality**
   - Linting checks
   - Type checking

3. **Build Verification**
   - Ensures the application builds successfully
   - Generates test reports

4. **Artifacts**
   - Test reports are uploaded as artifacts
   - Available for 30 days after each run

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (using conventional commit format)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request
```
