import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { redirect } from "next/navigation";
import React, { use } from "react";
import Nav from "./components/Nav";
import EditRoleMobile from "./components/EditRoleMobile";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import DeliveryBoy from "./components/DeliveryBoy";
import Grocery, { IGrocery } from "@/models/grocery.model";
import GeoUpdater from "./components/GeoUpdater";
import Footer from "./components/Footer";

async function Home(props: {
  searchParams: Promise<{
    q: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  await connectDb();

  const session = await auth();

  if (!session?.user?.id && !session?.user?.email) {
    redirect("/login");
  }

  const user = session?.user?.id
    ? await User.findById(session.user.id).lean()
    : await User.findOne({ email: session?.user?.email }).lean();

  if (!user) {
    redirect("/login");
  }

  const plainUser = {
    ...user,
    _id: user._id.toString(),
  };

  const inComplete =
    !plainUser.mobile ||
    !plainUser.role ||
    (plainUser.role === "user" && !plainUser.mobile);

  if (inComplete) {
    return <EditRoleMobile />;
  }

  // ✅ FETCH GROCERY HERE
  let groceryList: IGrocery[] = [];

  if (plainUser.role === "user") {
    const groceries = await Grocery.find().lean();

    groceryList = groceries.map((item: any) => ({
      ...item,
      _id: item._id.toString(),
      createdAt: item.createdAt?.toISOString(),
      updatedAt: item.updatedAt?.toISOString(),
    }));

    // Filter by search query if present
    const searchQuery = searchParams?.q?.toLowerCase().trim();
    if (searchQuery) {
      groceryList = groceryList.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchQuery) ||
          item.category?.toLowerCase().includes(searchQuery),
      );
    }
  }

  return (
    <div>
      <Nav user={plainUser} />
      <GeoUpdater userId={plainUser._id} />
      {plainUser.role === "user" ? (
        <UserDashboard groceryList={groceryList} />
      ) : plainUser.role === "admin" ? (
        <AdminDashboard />
      ) : (
        <DeliveryBoy />
      )}
      <Footer />
    </div>
  );
}

export default Home;
