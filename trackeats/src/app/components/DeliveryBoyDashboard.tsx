"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import { getSocket } from "@/lib/socket";
import { div } from "motion/react-client";
import LiveMap from "./LiveMap";
import DeliveryChat from "./DeliveryChat";
import { Loader } from "lucide-react";

type Assignment = {
  _id: string;
  order?: {
    _id?: string;
    address?: {
      fullAddress?: string;
    };
  };
};

interface ILocation {
  latitude: number;
  longitude: number;
}
function DeliveryBoyDashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const { userData } = useSelector((state: RootState) => state.user);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);

  const fetchAssignments = async () => {
    try {
      const result = await axios.get("/api/delivery/get-assignments");
      const assignmentList = Array.isArray(result.data?.assignments)
        ? result.data.assignments
        : Array.isArray(result.data)
          ? result.data
          : [];
      setAssignments(assignmentList);
    } catch (error) {
      console.log(error);
      setAssignments([]);
    }
  };

  useEffect(() => {
    const socket = getSocket();
    if (!userData?._id) return;
    if (!navigator.geolocation) return;
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setDeliveryBoyLocation({
          latitude: lat,
          longitude: lon,
        });
        socket.emit("update-location", {
          userId: userData?._id,
          latitude: lat,
          longitude: lon,
        });
      },
      (err) => {
        console.log(err);
      },
      { enableHighAccuracy: true },
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, [userData?._id]);

  useEffect((): any => {
    const socket = getSocket();

    socket.on("new-assignment", (deliveryAssignment) => {
      setAssignments((prev) => [...prev, deliveryAssignment]);
    });
    return () => socket.off("new-assignment");
  }, []);

  const handleAccept = async (id: string) => {
    try {
      const result = await axios.get(
        `/api/delivery/assignment/${id}/accept-assignment`,
      );
      fetchCurrentOrder();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCurrentOrder = async () => {
    try {
      const result = await axios.get("/api/delivery/current-order");
      if (result.data.active) {
        setActiveOrder(result.data.assignment);
        setUserLocation({
          latitude: result.data.assignment.order.address.latitude,
          longitude: result.data.assignment.order.address.longitude,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect((): any => {
    const socket = getSocket();
    socket.on("update-deliveryBoy-location", ({ userId, location }) => {
      setDeliveryBoyLocation({
        latitude: location.coordinates[1],
        longitude: location.coordinates[0],
      });
    });
    return () => socket.off("update-deliveryBoy-location");
  }, []);

  useEffect(() => {
    fetchCurrentOrder();
    fetchAssignments();
  }, [userData]);

  const sendOtp = async () => {
    setSendOtpLoading(true);
    try {
      const result = await axios.post("/api/delivery/otp/send", {
        orderId: activeOrder.order._id,
      });
      console.log(result.data);
      setShowOtpBox(true);
      setSendOtpLoading(false);
    } catch (error) {
      console.log(error);
      setSendOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    setVerifyOtpLoading(true);
    try {
      const result = await axios.post("/api/delivery/otp/verify", {
        orderId: activeOrder.order._id,
        otp,
      });
      console.log(result.data);
      setActiveOrder(null);
      setVerifyOtpLoading(false);
      await fetchCurrentOrder();
      window.location.reload();
    } catch (error) {
      setOtpError("Otp Verification Error");
      setVerifyOtpLoading(false);
    }
  };

  if (activeOrder && userLocation) {
    return (
      <div className="p-4 pt-30 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-green-700 mb-2">
            Active Delivery
          </h1>
          <p className="text-gray-600 text-sm mb-4">
            order#{activeOrder.order._id.slice(-6)}
          </p>

          <div className="rounded-xl border shadow-lg overflow-hidden mb-6">
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
            <DeliveryChat
              orderId={activeOrder.order._id}
              deliveryBoyId={userData?._id?.toString()!}
            />

            <div className="mt-6 bg-white rounded-xl border shadow p-6">
              {!activeOrder.order.deliveryOtpVerification && !showOtpBox && (
                <button
                  onClick={sendOtp}
                  className="w-full py-4 bg-green-600 text-center text-white rounded-lg"
                >
                  {sendOtpLoading ? (
                    <Loader
                      size={16}
                      className="animate-spin text-white text-center"
                    />
                  ) : (
                    "Mark as Delivered"
                  )}
                </button>
              )}
              {showOtpBox && (
                <div className="mt-4">
                  <input
                    type="text"
                    className="w-full py-3 border rounded-lg text-center"
                    placeholder="Enter Otp"
                    maxLength={4}
                    onChange={(e) => setOtp(e.target.value)}
                    value={otp}
                  />
                  <button
                    className="w-full mt-4 bg-blue-600 text-white py-3 text-center rounded-lg"
                    onClick={verifyOtp}
                  >
                    {verifyOtpLoading ? (
                      <Loader
                        size={16}
                        className="animate-spin text-white text-center"
                      />
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                  {otpError && (
                    <div className="text-red-600 mt-2">{otpError}</div>
                  )}
                </div>
              )}
              {activeOrder.order.deliveryOtpVerification && (
                <div className="text-green-700 text-center font-bold">
                  Delivery completed!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mt-30 mb-7.5">Delivery Assigments</h2>

        {assignments.map((a, index) => (
          <div
            key={index}
            className="p-5 bg-white rounded-xl shadow mb-4  border"
          >
            <p>
              <b>Order Id </b> #{a?.order?._id?.slice(-6) || "N/A"}
            </p>
            <p className="text-gray-600">
              {a?.order?.address?.fullAddress || "Address not available"}
            </p>
            <div className="flex gap-3 mt-4">
              <button
                className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                onClick={() => {
                  if (a._id) handleAccept(a._id);
                }}
              >
                Accept
              </button>
              <button className="flex-1 bg-red-600 text-white py-2 rounded-lg">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeliveryBoyDashboard;
