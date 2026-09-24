# Creating and Extending Content Types

1. Add the new type enum in `packages/shared/src/constants/index.ts` (`CONTENT_TYPES`).
2. Add the enum value to `prisma/schema.prisma` (`enum ContentType`).
3. Run `pnpm --filter @contentpilot/backend prisma:generate`.
4. Rebuild shared package: `pnpm --filter @contentpilot/shared build`.
