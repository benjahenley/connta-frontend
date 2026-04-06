export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col font-sans text-gray-800 w-full min-w-0">
      {children}
    </div>
  );
}
