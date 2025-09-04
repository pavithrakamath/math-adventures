# Contributing to Math Adventures

Thank you for your interest in contributing to Math Adventures! This document provides guidelines and information for contributors.

## 🎯 Project Goals

Math Adventures is designed to make mathematics engaging and accessible for 6th-grade students through interactive visualizations and hands-on learning experiences.

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Git

### Development Setup

1. **Fork and clone the repository**
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

4. **Run tests**
   ```bash
   npm run test
   ```

## 📋 How to Contribute

### Reporting Issues

Before creating an issue, please:
- Check if the issue already exists
- Use the issue templates provided
- Include steps to reproduce the problem
- Provide environment details (browser, OS, etc.)

### Suggesting Features

We welcome feature suggestions! Please:
- Check existing feature requests first
- Provide a clear description of the proposed feature
- Explain how it would benefit 6th-grade students
- Consider the educational value and user experience

### Code Contributions

#### Types of Contributions We Welcome

- **Bug fixes**: Fix existing issues
- **New visualizations**: Add interactive math components
- **UI/UX improvements**: Enhance the user experience
- **Educational content**: Improve lesson content and questions
- **Performance optimizations**: Make the app faster and more efficient
- **Accessibility improvements**: Make the app more accessible
- **Tests**: Add or improve test coverage
- **Documentation**: Improve code and user documentation

#### Development Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding standards
   - Write tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run lint
   npm run test
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new interactive fraction visualizer"
   ```

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📏 Coding Standards

### Code Style
- Use TypeScript for all new code
- Follow the existing ESLint configuration
- Use meaningful variable and function names
- Write self-documenting code with clear comments

### Component Guidelines
- Use functional components with hooks
- Keep components focused and single-purpose
- Use TypeScript interfaces for props
- Follow the existing component structure

### Testing
- Write tests for new components and features
- Aim for high test coverage
- Use descriptive test names
- Test both happy path and edge cases

### Educational Considerations
- Keep the target audience (6th graders) in mind
- Ensure UI is intuitive and not overwhelming
- Use clear, age-appropriate language
- Provide immediate feedback for user actions

## 🎨 Design Guidelines

### Visual Design
- Use the existing color palette and design system
- Ensure components are visually appealing to young learners
- Use appropriate font sizes and spacing
- Make interactive elements clearly identifiable

### User Experience
- Keep interactions simple and intuitive
- Provide clear instructions and feedback
- Use animations and transitions appropriately
- Ensure the app works well on different screen sizes

## 📚 Educational Content Guidelines

### Lesson Content
- Align with 6th-grade mathematics standards
- Use clear, age-appropriate language
- Provide step-by-step guidance
- Include real-world examples when possible

### Questions and Assessments
- Create questions that reinforce learning
- Use multiple question types (multiple choice, interactive, etc.)
- Provide helpful hints and explanations
- Ensure questions are challenging but not frustrating

## 🔍 Review Process

### Pull Request Guidelines
- Provide a clear description of changes
- Include screenshots for UI changes
- Reference related issues
- Ensure all tests pass
- Request review from maintainers

### Review Criteria
- Code quality and style
- Educational value and appropriateness
- Test coverage
- Documentation updates
- Performance impact
- Accessibility considerations

## 🐛 Bug Reports

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to reproduce**: Detailed steps to reproduce the bug
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: Browser, OS, device information
- **Screenshots**: If applicable

## 💡 Feature Requests

When suggesting features, please include:

- **Description**: Clear description of the proposed feature
- **Educational value**: How it would help 6th-grade students
- **Use cases**: Specific scenarios where it would be useful
- **Mockups or examples**: Visual representations if applicable

## 📞 Getting Help

If you need help or have questions:

1. Check the [Issues](https://github.com/yourusername/math-adventures/issues) page
2. Create a new issue with the "question" label
3. Join our community discussions
4. Contact the maintainers directly

## 🙏 Recognition

Contributors will be recognized in:
- The project README
- Release notes
- The project's contributors page

Thank you for contributing to Math Adventures! Together, we can make mathematics more engaging and accessible for young learners everywhere.
