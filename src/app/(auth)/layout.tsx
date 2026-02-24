export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="w-full max-w-[400px] px-6">
        <div className="text-center mb-8">
          <span className="font-[family-name:var(--font-syne)] text-[24px] font-extrabold tracking-[-0.02em]">
            ArtRoom
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
