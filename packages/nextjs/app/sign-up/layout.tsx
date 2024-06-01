import "@rainbow-me/rainbowkit/styles.css";
import { AppProviders } from "~~/components/AppProviders";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppProviders>
      <main className="flex flex-col items-center bg-black h-dvh overflow-hidden">{children}</main>
    </AppProviders>
  );
};

export default Layout;
