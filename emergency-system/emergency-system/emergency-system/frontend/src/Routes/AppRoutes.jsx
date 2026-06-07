import React from "react";
import { Layout } from "../Components/Layout/Layout";
import { MainLayout } from "../Components/Layout/MainLayout";
import { Route, Routes } from "react-router-dom";
import PainterBlog from "../Pages/Painter/Painter";
import PlumberBlog from "../Pages/Plumber/Plumber";
import ElectricianBlog from "../Pages/Electrician/Electrician";
import CarpenterBlog from "../Pages/Carpenter/Carpenter";
import BookingForm from "../Pages/BookingForm/BookingForm";
import BookingOptions from "../Pages/BookingOrder/BookingOptions";
import AboutUs from "../Pages/AboutUs/AboutUs";
import Services from "../Components/Services/Services";
import Blog from "../Pages/Blog/Blog";
import { Home } from "../Pages/Home/Home";
import { AdminSidebar } from "../Components/AdminLeftSidebar/AdminSidebar";
import {Admin} from "../Pages/AdminPage/Admin";
import {ApprovedUsers} from "../Components/AdminRightContent/ApprovedUsers/ApprovedUsers";
import {UserRequests} from "../Components/AdminRightContent/UserRequests/UserRequests";
import { AdminSignup } from "../Components/AdminSignup/AdminSignup";
import { AdminLogin } from "../Components/AdminLogin/AdminLogin";
import { BookingOption } from "../Components/AdminRightContent/BookingOption/BookingOption";
import MyBookings from "../Pages/MyBookings/MyBookings";
import { Login } from "../Components/Login/Login";
import { Signup } from "../Components/Signup/Signup";
import { UserSignup } from "../Components/UserSignup/UserSignup";
import { LoginPortal } from "../Pages/LoginPortal/LoginPortal";
import LiveTracking from "../Pages/LiveTracking/LiveTracking";
import ServiceProvider from "../Pages/AboutUs/ServiceProvider";

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/booking-options" element={<BookingOptions />} />
          <Route path="/live-tracking" element={<LiveTracking />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/service-provider" element={<ServiceProvider />} />
          <Route
            path="/booking-options/booking-form"
            element={<BookingForm />}
          />
          <Route path="/carpenter" element={<CarpenterBlog />} />
          <Route path="/electrician" element={<ElectricianBlog />} />
          <Route path="/plumber" element={<PlumberBlog />} />
          <Route path="/painter" element={<PainterBlog />} />
        </Route>

        <Route element={<Layout />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/user-signup" element={<UserSignup />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/login" element={<LoginPortal />} />
        </Route>

        <Route path="admin-dashboard" element={<Admin/>} >
            <Route index element={<ApprovedUsers/>} />
            <Route path="user-request"  element={<UserRequests/>} />
            <Route path="booking-option"  element={<BookingOption/>} />
        </Route>

        <Route path="/admin-sidebar" element={<AdminSidebar/>} />

        <Route path="/admin-signup" element={<AdminSignup/>} />
        <Route path="/admin-login"  element={<AdminLogin/>}/>
      </Routes>
    </>
  );
}

export default AppRoutes;
