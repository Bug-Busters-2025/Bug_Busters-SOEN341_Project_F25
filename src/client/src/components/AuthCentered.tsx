export default function AuthCentered({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center px-4">
      {children}
    </div>
  );
}