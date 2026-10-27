# GitHub Workflow

This document defines the GitHub workflow that the LocalLoop team will follow when creating, reviewing, testing, and merging changes. The goal is to keep development organized and ensure that changes are reviewed before being added to the main codebase.

## Branch Naming Conventions

All development work should be completed on a separate branch rather than directly on `main`.

Branches should follow this naming format:

`<type>/<issue-number>-<short-description>`

### Branch Types

- `feature/` - New features or functionality
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code restructuring that does not change functionality
- `test/` - Adding or updating tests

### Examples

- `feature/business-profile`
- `feature/product-listing`
- `fix/login-error`
- `docs/update-readme`

When possible, branches should be associated with an existing GitHub issue.

---

## Pull Request Expectations

Once work on a branch is ready to be reviewed, a Pull Request (PR) should be created.

Each PR should:

- Have a clear and descriptive title.
- Reference the related GitHub issue.
- Include a short description of what was changed.
- Explain any important implementation decisions when necessary.
- Be focused on one task or issue whenever possible.
- Be tested by the developer before requesting a review.
- Pass linting and other automated checks before being merged.

Developers should review their own changes before submitting the PR to catch unnecessary files, debugging code, or other issues.

---

## Code Review Expectations

At least **one other team member** should review and approve a Pull Request before it is merged.

The reviewer should check:

- Whether the code meets the requirements of the related issue.
- Whether the code works as expected.
- Whether the code is readable and follows the project's coding standards.
- Whether there are obvious bugs or unintended changes.
- Whether unnecessary or unrelated changes were included.
- Whether appropriate testing has been completed.

If changes are requested, the developer should address the feedback and push the updates to the same branch. The PR should then be reviewed again if necessary.

Team members should keep feedback constructive and focused on improving the project.

---

## Merging Into Main

The `main` branch should contain the current stable version of the LocalLoop application.

The following process should be followed:

1. Create or select the GitHub issue being worked on.
2. Create a new branch from the latest version of `main`.
3. Complete the work on the new branch.
4. Test the changes locally.
5. Commit and push the changes to GitHub.
6. Open a Pull Request into `main`.
7. Request a review from at least one team member.
8. Address any requested changes.
9. Ensure required checks pass and the PR has been approved.
10. Merge the Pull Request into `main`.

Developers should **not push changes directly to `main`**. Changes should normally enter `main` through an approved Pull Request.

If a merge conflict occurs, it should be resolved and the affected functionality should be tested again before the PR is merged.

---

## Workflow Summary

`GitHub Issue → Create Branch → Develop → Test → Pull Request → Code Review → Approval → Merge into Main`

Following this workflow will help the team keep the LocalLoop codebase organized and reduce the chance of unreviewed or broken changes being introduced into the main branch.