import StoreProvider from "../store-provider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StoreProvider>{children}</StoreProvider>;
}
