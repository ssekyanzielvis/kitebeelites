import Header from "@/components/Header";
import Footer from "@/components/Footer";

import ThemeWrapper from "@/components/ThemeWrapper";

export default function VisitorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeWrapper>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </ThemeWrapper>
  );
}
