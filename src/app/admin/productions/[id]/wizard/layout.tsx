export default function WizardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-[#0c0c0e] md:left-64">
      {children}
    </div>
  );
}
