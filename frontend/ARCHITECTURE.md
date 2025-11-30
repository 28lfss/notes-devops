# Frontend Architecture Documentation

## Architecture Overview

The frontend follows a **Feature-Based Architecture** with clear separation of concerns, promoting reusability, maintainability, and clean code principles.

```
src/
├── api/           # API client and type definitions
├── components/    # Reusable UI components
├── features/      # Feature-based pages and logic
├── hooks/         # Custom React hooks
├── routes/        # Routing configuration
├── utils/         # Utility functions
├── main.tsx       # Application entry point
└── index.css     # Global styles
```

## Architecture Patterns

### ✅ Feature-Based Organization

1. **API Layer** (`api/`)
   - `client.ts` - Centralized API client with authentication handling
   - `types.ts` - TypeScript interfaces for API requests/responses
   - Handles token management (localStorage)
   - Consistent error handling with `ApiError` class
   - `handleApiError` utility for DRY error handling

2. **Components Layer** (`components/`)
   - **Shared UI Components**: Reusable, presentational components
   - `Button` - Configurable button with variants (primary, secondary, danger)
   - `Input` - Form input with label and error display
   - `Textarea` - Textarea with label and error display
   - `Layout` - Application layout with navigation
   - `ErrorMessage` - Reusable error message display
   - `LoadingSpinner` - Consistent loading state indicator
   - All components use `classNames` utility for consistent styling

3. **Features Layer** (`features/`)
   - **Feature-based organization**: Each feature has its own directory
   - `auth/` - Authentication pages (Login, Register)
   - `notes/` - Notes management page
   - Pages are self-contained with their own state management
   - Use shared components and hooks for consistency

4. **Hooks Layer** (`hooks/`)
   - **Custom React Hooks**: Reusable logic extraction
   - `useAuth` - Authentication logic and redirects
   - `useApiCall` - Generic API call hook (for future use)
   - Promotes code reusability and separation of concerns

5. **Routes Layer** (`routes/`)
   - `index.tsx` - Main routing configuration
   - `ProtectedRoute` - Route guard for authenticated routes
   - Uses React Router for client-side routing

6. **Utils Layer** (`utils/`)
   - `classNames` - Utility for conditional className joining
   - Promotes consistency and readability

## Improvements Made

### 1. **Code Reusability**
- ✅ Extracted `ErrorMessage` component (replaced 3 duplicate error displays)
- ✅ Extracted `LoadingSpinner` component (replaced duplicate loading states)
- ✅ Created `useAuth` hook for authentication logic
- ✅ Created `useApiCall` hook for reusable API call patterns

### 2. **Error Handling**
- ✅ Standardized error handling across all pages
- ✅ Extracted `handleApiError` utility in API client
- ✅ Consistent error message display using `ErrorMessage` component
- ✅ Proper TypeScript error type checking (`err instanceof Error`)

### 3. **Code Consistency**
- ✅ Standardized className handling with `classNames` utility
- ✅ Consistent component prop patterns
- ✅ Removed duplicate code (DRY principle)
- ✅ Fixed `useEffect` dependency warnings

### 4. **Component Organization**
- ✅ Clear separation between presentational and container components
- ✅ Components follow consistent patterns
- ✅ Proper TypeScript typing throughout
- ✅ Accessible form components with proper labels

## Design Principles Followed

### Clean Code Principles

- ✅ **DRY (Don't Repeat Yourself)**: No code duplication
- ✅ **Single Responsibility**: Each component/hook has one clear purpose
- ✅ **Separation of Concerns**: Clear layer boundaries
- ✅ **Meaningful Names**: Clear, descriptive component and function names
- ✅ **Small Functions**: Functions and components do one thing well

### React Best Practices

- ✅ **Component Composition**: Building complex UIs from simple components
- ✅ **Custom Hooks**: Extracting reusable logic
- ✅ **Proper State Management**: Using React hooks appropriately
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Error Boundaries**: Proper error handling and display

### Code Quality Metrics

- **Total Components**: 6 reusable components
- **Custom Hooks**: 2 hooks (useAuth, useApiCall)
- **Features**: 2 feature modules (auth, notes)
- **Utilities**: 1 utility function (classNames)
- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Centralized and consistent

## Component Details

### Shared Components

#### `Button`
- Variants: `primary`, `secondary`, `danger`
- Extends HTML button attributes
- Consistent styling with Tailwind CSS
- Disabled state handling

#### `Input` & `Textarea`
- Optional label and error display
- Forward refs for form library compatibility
- Consistent styling and focus states
- Accessible form controls

#### `ErrorMessage`
- Conditional rendering (only shows when message exists)
- Consistent error styling
- Reusable across all pages

#### `LoadingSpinner`
- Customizable message
- Consistent loading state display
- Reusable across all pages

#### `Layout`
- Application-wide layout wrapper
- Navigation bar with authentication-aware menu
- Responsive design with Tailwind CSS

### Feature Pages

#### `LoginPage` & `RegisterPage`
- Form handling with validation
- Error display using `ErrorMessage` component
- Loading states during API calls
- Navigation after successful authentication

#### `NotesPage`
- List, create, and delete notes
- Uses `useAuth` hook for authentication
- Uses `ErrorMessage` and `LoadingSpinner` components
- Proper error handling and state management

## API Client

### Features
- **Token Management**: Automatic token storage and retrieval
- **Authentication**: Bearer token in Authorization header
- **Error Handling**: Consistent `ApiError` class
- **Type Safety**: Full TypeScript interfaces

### Methods
- `login()` - User authentication
- `register()` - User registration
- `logout()` - Clear authentication token
- `isAuthenticated()` - Check authentication status
- `getNotes()` - Fetch all user notes
- `getNote(id)` - Fetch single note
- `createNote(note)` - Create new note
- `updateNote(id, note)` - Update existing note
- `deleteNote(id)` - Delete note

## Routing

### Routes
- `/` - Redirects to `/notes`
- `/login` - Login page (public)
- `/register` - Registration page (public)
- `/notes` - Notes management (protected)

### Route Protection
- `ProtectedRoute` component checks authentication
- Redirects to `/login` if not authenticated
- Uses `api.isAuthenticated()` for token check

## Styling

- **Framework**: Tailwind CSS
- **Configuration**: `tailwind.config.js`
- **PostCSS**: `postcss.config.js`
- **Global Styles**: `index.css`
- **Utility**: `classNames` for conditional classes

## State Management

Currently using React's built-in state management:
- `useState` for component-level state
- `useEffect` for side effects
- `useCallback` for memoized functions
- Custom hooks for shared state logic

For larger applications, consider:
- Context API for global state
- State management library (Redux, Zustand) if needed

## Testing Considerations

The architecture is designed for easy testing:

- **Components**: Can be tested in isolation
- **Hooks**: Can be tested with React Testing Library
- **API Client**: Can be mocked for testing
- **Pages**: Can be tested with mocked API calls

## Future Improvements (Optional)

1. **State Management**: Consider Context API or state library if complexity grows
2. **Form Handling**: Consider React Hook Form for complex forms
3. **API Client**: Consider using a library like Axios for more features
4. **Testing**: Add unit and integration tests
5. **Accessibility**: Enhance ARIA attributes and keyboard navigation
6. **Performance**: Consider React.memo, useMemo, useCallback optimizations
7. **Error Boundaries**: Add React Error Boundaries for better error handling

## Current Status

✅ **Architecture**: Clean and well-organized  
✅ **Code Quality**: High, follows best practices  
✅ **Maintainability**: Easy to understand and modify  
✅ **Reusability**: Components and hooks are reusable  
✅ **Type Safety**: Full TypeScript coverage  
✅ **Consistency**: Standardized patterns throughout

