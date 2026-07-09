# 12. Engineering Standards

## Core Expectations
Every feature should:
- build successfully
- pass linting
- be documented
- support Light Mode and Dark Mode
- be responsive
- preserve accessibility
- avoid unnecessary dependencies
- include release notes when relevant
- maintain clean architecture
- follow the product's non-advisory tone and positioning

## Project Structure
The repository should remain easy to navigate and consistent across contributors.

### Folder Structure
- keep application code under the existing app structure unless a clear need for new top-level organization exists
- place product and architecture documentation under docs
- keep public assets under public
- avoid mixing unrelated concerns in the same folder
- group related UI, logic, and configuration together

### Naming Conventions
- use descriptive, domain-focused names over generic ones
- prefer lowercase filenames for simple modules and shared resources
- use PascalCase for React component names
- use camelCase for functions, variables, and props
- use UPPER_SNAKE_CASE only for well-defined constants where appropriate

## Frontend Standards

### React Components
- keep components focused on a single responsibility
- prefer composable components over large monolithic ones
- keep props explicit and minimal
- avoid hidden side effects inside presentational components
- use meaningful names for state, handlers, and derived values
- keep styling and behavior close to the component when practical

### Next.js Routing
- prefer file-based routing conventions provided by Next.js
- keep route structure aligned with product modules and user flows
- avoid unnecessary route nesting when a flatter structure improves clarity
- keep page-level logic simple and delegate complex behavior to reusable modules

### TypeScript
- use TypeScript for application code
- prefer explicit types for shared interfaces, props, and API shapes
- avoid overly broad types when a more precise type improves safety
- keep type definitions close to the code that uses them when practical

### Tailwind CSS
- use Tailwind utility classes for styling consistency
- favor clear, readable class composition over overly clever patterns
- keep styling aligned with the design system and theme expectations
- avoid introducing custom styling patterns that duplicate existing utilities without reason

## Collaboration Standards

### Git Commit Messages
Use concise, purpose-driven commit messages.

| Type | Example | When to use |
| --- | --- | --- |
| feat | feat: add dashboard summary card | New user-facing functionality |
| fix | fix: correct dark theme contrast issue | Bug fixes |
| docs | docs: expand architecture standards | Documentation-only changes |
| refactor | refactor: simplify scoring view state | Internal code cleanup |
| chore | chore: update dependency versions | Maintenance and tooling |

### Branch Naming
- use short, descriptive branch names
- prefer lowercase hyphen-separated names
- examples: feature/dashboard-summary, fix/theme-contrast, docs/architecture-standards

## Documentation Standards
- keep documentation concise, accurate, and current
- update docs when behavior, architecture, or workflow changes
- use TODO sections for unresolved decisions and open questions
- keep terminology aligned with the product vocabulary used in the docs

## Testing Standards
- write or update tests for behavior changes whenever practical
- prefer meaningful integration-style coverage over brittle unit tests
- ensure new behavior does not regress existing flows
- verify accessibility and responsive behavior when relevant

## Accessibility Standards
- support keyboard navigation for interactive elements
- preserve semantic HTML structure
- maintain sufficient color contrast
- ensure screen-reader-friendly labels and names
- avoid relying on color alone to communicate state

## Performance Standards
- keep initial experiences responsive and lightweight
- avoid unnecessary re-renders and redundant data fetching
- prefer efficient rendering patterns for dashboard and workspace surfaces
- avoid introducing heavy dependencies without a clear need

## Code Review Standards
- review for correctness, clarity, maintainability, and product fit
- confirm that changes align with the product's non-advisory positioning
- verify that documentation is updated when behavior changes
- keep reviews focused on the change and its impact

## Security Standards
- avoid exposing secrets or credentials in code or documentation
- handle authentication and user data with care
- use secure defaults for configuration and environment handling
- avoid introducing unnecessary third-party dependencies that expand the attack surface

## Dependency Management
- add dependencies only when they clearly solve a real problem
- prefer existing patterns and established tools over introducing alternatives
- review dependency size, maintenance status, and compatibility before adoption
- keep dependencies up to date in a controlled and intentional way

## Release Process
- ensure the change is documented and review-ready before release
- verify build, lint, and relevant tests before shipping
- include release notes for user-visible changes where appropriate
- preserve a clear trail of decisions and changes for future contributors

---

## TODO

### High
- What decision must be made first to unblock the next milestone?
- What user or product risk is most urgent to resolve?
- Which requirement is still ambiguous and needs stakeholder input?

### Medium
- What implementation choice should be clarified before development begins?
- What additional product or UX detail should be defined next?
- Which trade-off should be documented before the feature is prioritized?

### Low
- What future enhancement would benefit from early documentation?
- What minor detail should be captured as the product evolves?
- What open question is useful to keep visible for later refinement?

## Related Documents
- [02-Principles.md](02-Principles.md)
- [03-Architecture.md](03-Architecture.md)
- [04-Design-System.md](04-Design-System.md)
- [05-Product-Decisions.md](05-Product-Decisions.md)
