# Task Management Dashboard

## Project Setup

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Compiles and hot-reloads for development

```bash
npm run serve
```

4. Compiles and minifies for production

```bash
npm run build
```

5. Run unit tests

```bash
npm run test:unit
```

## Features

- Paginated task list
- Create, Update, Delete tasks
- Task filtering and sorting
- Responsive design

## Technologies

- Vue 3
- TypeScript
- Pinia
- Vuetify
- Axios

## Project Structure

- `src/types/`: TypeScript interfaces
- `src/plugins/`: Configuration for vuetify
- `src/services/`: API interaction logic
- `src/stores/`: Pinia state management
- `src/components/`: Vue components
- `src/views/`: Vue views
- `src/router/`: Vue router configuration
- `tests/`: Unit tests
- `public/`: Static assets

## Testing

Unit tests are located in the `tests` directory.

## env.example

VITE_API_BASE_URL=
