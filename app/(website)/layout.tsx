import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />

      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
