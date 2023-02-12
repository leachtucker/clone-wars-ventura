type ShowProps = {
  when: boolean;
  fallback?: React.ReactNode;
} & React.PropsWithChildren;

export function Show({ children, when, fallback }: ShowProps) {
  if (when != true) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
