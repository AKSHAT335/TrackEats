import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/Provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/InitUser";
import InitSocket from "@/InitSocket";

export const metadata: Metadata = {
  title: "TrackEats",
  description:
    "10 mins delivery | Fresh & Delicious | TrackEats - Your Food Delivery Companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-linear-to-b from-green-50 to-white min-h-screen w-full">
        <Provider>
          <StoreProvider>
            <InitUser />
            <InitSocket />
            {children}
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}
