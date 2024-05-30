import "@rainbow-me/rainbowkit/styles.css";
import { AppProviders } from "~~/components/AppProviders";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <AppProviders>{children}</AppProviders>;
};

export default Layout;
