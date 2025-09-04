# Math Adventures 🧮

An interactive educational platform designed to make mathematics engaging and fun for 6th-grade students. Built with React, TypeScript, and modern web technologies.

## ✨ Features

### Interactive Math Components
- **FactorChecker**: Interactive prime number and factor discovery tool
- **PatternVisualizer**: Visual number pattern recognition and completion
- **ClickableLessonBarChart**: Interactive data handling and interpretation
- **ShapeVisualizer**: Perimeter and area visualization on grids
- **SymmetryVisualizer**: Interactive symmetry line discovery
- **FractionVisualizer**: Visual fraction manipulation and common denominators

### Educational Features
- **Progressive Learning**: Structured lessons that build upon each other
- **Interactive Demos**: Hands-on learning experiences
- **Visual Feedback**: Immediate responses to student interactions
- **Kid-Friendly UI**: Designed specifically for 6th-grade learners
- **Progress Tracking**: Local storage for lesson completion tracking

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/math-adventures.git
   cd math-adventures
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run test:watch` - Run tests in watch mode

## 🏗️ Project Structure

```
src/
├── components/
│   ├── layout/           # Layout components (Header, Navigation, etc.)
│   ├── lessons/          # Lesson-related components
│   ├── ui/               # Reusable UI components
│   └── visualizations/   # Interactive math visualizations
├── data/
│   ├── lessons.tsx       # Lesson definitions
│   └── questions.tsx     # Question bank
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── test/                 # Test setup and utilities
```

## 🎯 Educational Philosophy

This platform is designed with 6th-grade students in mind, focusing on:

- **Visual Learning**: Complex mathematical concepts made visual and interactive
- **Immediate Feedback**: Students learn through trial and error with instant responses
- **Gamification**: Learning through play and discovery
- **Accessibility**: Clear, simple interfaces that don't overwhelm young learners
- **Progressive Difficulty**: Concepts build upon each other naturally

## 🧪 Testing

The project includes comprehensive testing setup:

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### GitHub Pages
The project is configured for automatic deployment to GitHub Pages:

1. Push to the `main` branch
2. GitHub Actions will automatically build and deploy
3. Your site will be available at `https://yourusername.github.io/math-adventures`

### Manual Deployment
```bash
# Build the project
npm run build

# The built files will be in the `dist/` directory
# Deploy the contents of `dist/` to your hosting provider
```

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand
- **Testing**: Vitest, Testing Library
- **Linting**: ESLint

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Educational content aligned with 6th-grade mathematics standards
- UI/UX design principles focused on young learners
- Modern web development best practices

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/yourusername/math-adventures/issues) page
2. Create a new issue if your question isn't answered
3. Contact the development team

---

**Made with ❤️ for young mathematicians everywhere!**