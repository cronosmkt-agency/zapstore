import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/$slug')({
  component: SlugLayout,
});

function SlugLayout() {
  return <Outlet />;
}
