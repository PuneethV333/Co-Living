import { lazy, Suspense, useEffect, useRef } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Spinner from "./components/Spinner";
import toast, { Toaster } from "react-hot-toast";
import Home from "./pages/Home/Home";

import { Auth } from "./config/firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useGetMe } from "./hooks/useAuth";
import { useGetNewNotifications } from "./hooks/useNotification";
import type { notificationType } from "./types/notification.types";

const Login = lazy(() => import("./pages/Login/Login"));
const OnBoarding = lazy(() => import("./pages/OnBoarding/OnBoarding"));
const Dashboard = lazy(() => import("./pages/Home/subPages/Dashboard"));
const PropertyDetail = lazy(() => import("./pages/property/PropertyDetail"));
const Browse = lazy(() => import("./pages/property/Browse"));
const ListProperty = lazy(() => import("./pages/property/ListProperty"));

const getNotificationMessage = (notification: notificationType) => {
  switch (notification.type) {
    case "VISIT_REQUEST":
      return "requested a property visit";

    case "MESSAGE":
      return "sent you a message";

    case "BOOKING_UPDATE":
      return "updated a booking";

    default:
      return "";
  }
};

const App = () => {
  const [user, authLoading] = useAuthState(Auth);
  const { data, isPending } = useGetMe();
  const { data: newNotification } = useGetNewNotifications();
  const shownNotifications = useRef(new Set<string>());

  useEffect(() => {
    if (!newNotification?.length) return;

    newNotification.forEach((notification) => {
      if (shownNotifications.current.has(notification.senderId.name)) {
        return;
      }

      shownNotifications.current.add(notification.senderId.name);

      toast.custom((toastInstance) => (
        <div
          className={`${
            toastInstance.visible
              ? "animate-custom-enter"
              : "animate-custom-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="shrink-0 pt-0.5">
                <img
                  className="h-10 w-10 rounded-full"
                  src={notification.senderId?.profilePic}
                  alt="user"
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.senderId.name}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {getNotificationMessage(notification)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(toastInstance.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ));
    });
  }, [newNotification]);

  if (authLoading || (user && isPending)) {
    return <Spinner />;
  }

  return (
    <>
      <Toaster position="top-right" />
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route
            path="/login"
            element={
              !user ? (
                <Login />
              ) : !data?.completeOnBoarding ? (
                <Navigate to="/on-boarding" replace />
              ) : (
                <Navigate to="/home" replace />
              )
            }
          />
          <Route
            path="/on-boarding"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : data?.completeOnBoarding ? (
                <Navigate to="/home" replace />
              ) : (
                <OnBoarding />
              )
            }
          />
          <Route
            path="/home"
            element={
              user ? (
                data?.completeOnBoarding ? (
                  <Home />
                ) : (
                  <Navigate to="/on-boarding" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="property/details/:id" element={<PropertyDetail />} />
            <Route path="browse" element={<Browse />} />
            <Route path="create/Property" element={<ListProperty />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
