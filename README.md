# Code Review Agent 🤖

An intelligent AI-powered code review agent that automatically analyzes code changes, provides detailed feedback, and generates commit messages following conventional commit standards.

## Features

### Core Capabilities
- **Automated Code Review**: Analyzes git diffs and provides comprehensive feedback on code quality
- **Conventional Commit Messages**: Generates properly formatted commit messages using AI
- **Markdown Reports**: Creates detailed review reports in markdown format
- **Multi-file Analysis**: Reviews changes across multiple files in a single run
- **Expert-level Feedback**: Provides professional, constructive code review insights

### Review Focus Areas
The agent evaluates code across 8 key dimensions:

1. **Correctness** - Identifies bugs, logic errors, and edge cases
2. **Clarity** - Assesses code readability and maintainability
3. **Maintainability** - Evaluates code structure and complexity
4. **Consistency** - Ensures adherence to coding conventions
5. **Performance** - Identifies potential bottlenecks and inefficiencies
6. **Security** - Detects vulnerabilities and unsafe operations
7. **Testing** - Reviews test coverage and quality
8. **Scalability** - Considers robustness and error handling

## Tools & Components

### Available Tools

| Tool | Description | Purpose |
|------|-------------|---------|
| `getChangesInDirectory` | Analyzes git diffs in a directory | Collects all file changes for review |
| `generateCommitMessage` | Creates conventional commit messages | Summarizes changes for version control |
| `generateMarkdownFile` | Writes review reports to markdown files | Documents review findings |

### Technical Stack
- **Runtime**: Bun with TypeScript
- **AI Model**: Google Gemini 2.5 Flash
- **Git Integration**: simple-git for diff analysis
- **Validation**: Zod for schema validation
- **Streaming**: AI SDK for real-time text generation

## Prerequisites

- **Bun** runtime installed
- **TypeScript** (peer dependency)
- **Git** repository with changes to review
- **Google AI API Key** (for Gemini model access)

## Installation

1. **Clone or download** the project
2. **Install dependencies**:
   ```bash
   bun install
   ```
3. **Set up environment variables**:
   ```bash
   # Set your Google AI API key
   export GOOGLE_GENERATIVE_AI_API_KEY="your-api-key-here"
   ```

## Usage

### Basic Usage

Run the agent to review code changes in a directory:

```bash
bun run index.ts
```

### Custom Directory Review

Modify the `index.ts` file to review a specific directory:

```typescript
await CodeReviewAgent("Review the code changes in '../your-project' directory, make your reviews and suggestions file by file");
```

### Programmatic Usage

```typescript
import { CodeReviewAgent } from './index';

// Review changes in a specific directory
await CodeReviewAgent("Review the code changes in './src' directory");
```

## Project Structure

```
my-agent/
├── index.ts           # Main agent entry point
├── tools.ts           # Tool definitions and implementations
├── prompts.ts         # System prompts and AI instructions
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
└── README.md          # This documentation
```

## Configuration

### Customizing Review Behavior

Edit `prompts.ts` to modify the agent's review style:

```typescript
export const SYSTEM_PROMPT = `
You are an expert code reviewer...
// Customize the prompt here
`;
```

### Excluding Files

Modify the `excludeFiles` array in `tools.ts`:

```typescript
const excludeFiles = ["dist", "bun.lock", "node_modules", ".git"];
```

## Output Examples

### Commit Message Generation
```
feat: add user authentication system

- Implement JWT-based authentication
- Add password hashing with bcrypt
- Create user registration and login endpoints
```

### Review Report Structure
```markdown
# Code Review Summary

## File: src/auth.ts
✅ **Strengths:**
- Clean separation of concerns
- Proper error handling

⚠️ **Suggestions:**
- Consider adding input validation
- Extract constants to configuration file

## File: src/user.ts
✅ **Strengths:**
- Well-structured database queries
- Good use of TypeScript types

⚠️ **Suggestions:**
- Add unit tests for edge cases
- Consider adding rate limiting
```

## Use Cases

### Development Workflow Integration
- **Pre-commit reviews**: Catch issues before they reach the repository
- **Pull request analysis**: Automated review comments and suggestions
- **Code quality assurance**: Regular codebase health checks
- **Team onboarding**: Help new developers understand code standards

### CI/CD Pipeline
```yaml
# Example GitHub Actions workflow
- name: Code Review
  run: bun run index.ts
  env:
    GOOGLE_GENERATIVE_AI_API_KEY: ${{ secrets.GOOGLE_AI_KEY }}
```

## Advanced Features

### Custom Review Criteria
The agent can be configured to focus on specific aspects:

```typescript
// Focus on security issues
await CodeReviewAgent("Review the code changes focusing on security vulnerabilities and best practices");

// Focus on performance
await CodeReviewAgent("Review the code changes with emphasis on performance optimization");
```

### Batch Processing
Review multiple directories or branches:

```typescript
const directories = ['./src', './tests', './docs'];
for (const dir of directories) {
  await CodeReviewAgent(`Review changes in ${dir}`);
}
```

## Troubleshooting

### Common Issues

**"No changes detected"**
- Ensure you're in a git repository
- Check that files have been modified and staged
- Verify the directory path is correct

**API Key Issues**
- Confirm your Google AI API key is set correctly
- Check API quota and billing status
- Verify the key has the necessary permissions

**Permission Errors**
- Ensure the agent has read access to the target directory
- Check file permissions for markdown generation

### Debug Mode
Enable verbose logging by modifying the agent:

```typescript
const result = await streamText({
  model: google("models/gemini-2.5-flash"),
  prompt,
  system: SYSTEM_PROMPT,
  tools: { /* tools */ },
  stopWhen: stepCountIs(10),
  // Add debug options here
});
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the agent on your changes for self-review
5. Submit a pull request

## License

This project is private and intended for internal use.



## Support

For issues, questions, or feature requests, please:
1. Check the troubleshooting section above
2. Review existing issues in the repository
3. Create a new issue with detailed information

---

**Built with ❤️ using Bun, TypeScript, and Google AI**