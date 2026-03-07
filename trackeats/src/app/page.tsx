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

async function Home() {
  await connectDb();

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await User.findById(session.user.id).lean();

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
  }

  return (
    <div>
      <Nav user={plainUser} />
      <GeoUpdater userId={plainUser._id}/>
      {plainUser.role === "user" ? (
        <UserDashboard groceryList={groceryList} />
      ) : plainUser.role === "admin" ? (
        <AdminDashboard /> 
      ) : (
        <DeliveryBoy />
      )}
    </div>
  );
}

export default Home;
