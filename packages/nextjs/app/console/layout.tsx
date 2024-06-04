import "@rainbow-me/rainbowkit/styles.css";
import { ConsoleLayout } from "~console/_components";
import { AppProviders } from "~~/components/AppProviders";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppProviders>
      <ConsoleLayout>{children}</ConsoleLayout>
    </AppProviders>
  );
};

export default Layout;
