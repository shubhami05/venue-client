import React, { useState, useEffect } from 'react';
import { FaUsers, FaBuilding, FaCalendarCheck, FaMoneyBillAlt, FaStar, FaUserTie, FaChartLine, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOwners: 0,
    totalVenues: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingVenues: 0,
    activeVenues: 0,
    blockedVenues: 0,
    recentBookings: [],
    revenueTrend: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URI}/api/admin/dashboard`
      );

      if (response.data.success) {
        setStats({
          totalUsers: response.data.totalUsers || 0,
          totalOwners: response.data.totalOwners || 0,
          totalVenues: response.data.totalVenues || 0,
          totalBookings: response.data.totalBookings || 0,
          totalRevenue: response.data.totalRevenue || 0,
          pendingVenues: response.data.pendingVenues || 0,
          activeVenues: response.data.activeVenues || 0,
          blockedVenues: response.data.blockedVenues || 0,
          recentBookings: response.data.recentBookings || [],
          revenueTrend: response.data.revenueTrend || []
        });
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error.response?.data?.message || 'Failed to fetch analytics');
      toast.error(error.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="xl:container xl:mx-auto bg-orange-100 min-h-screen px-2 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-orange-900 mb-8 px-4">
        Dashboard Overview
      </h1>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="shadow-lg bg-orange-50 text-orange-700 p-4 rounded-md">
          <div className="flex justify-end">
            <FaUsers className="h-9 w-9 my-2" />
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-orange-900">{stats.totalUsers}</h3>
            <h3 className="text-lg font-semibold text-orange-900">Total Users</h3>
          </div>
        </div>
        <Link to="/admin/bookings" className="shadow-lg bg-orange-50 text-orange-700 p-4 rounded-md hover:bg-orange-50 transition-colors cursor-pointer">
          <div className="flex justify-end">
            <FaCalendarCheck className="h-9 w-9 my-2" />
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-orange-900">{stats.totalBookings}</h3>
            <h3 className="text-lg font-semibold text-orange-900">Total Bookings</h3>
          </div>
        </Link>

        <Link to="/admin/venues" className="shadow-lg bg-orange-50 text-orange-700 p-4 rounded-md hover:bg-orange-50 transition-colors cursor-pointer">
          <div className="flex justify-end">
            <FaBuilding className="h-9 w-9 my-2" />
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-orange-900">{stats.totalVenues}</h3>
            <h3 className="text-lg font-semibold text-orange-900">Total Venues</h3>
          </div>
        </Link>

        <Link to="/admin/owner/fetch" className="shadow-lg bg-orange-50 text-orange-700 p-4 rounded-md hover:bg-orange-50 transition-colors cursor-pointer">
          <div className="flex justify-end">
            <FaUserTie className="h-9 w-9 my-2" />
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-orange-900">{stats.totalOwners}</h3>
            <h3 className="text-lg font-semibold text-orange-900">Venue Owners</h3>
          </div>
        </Link>
      </div>

      {/* Middle Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-orange-50 shadow-lg rounded-md p-6 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenue Trend</h2>
          <div className="h-64 flex items-end justify-between space-x-2">
            {stats.revenueTrend.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="relative w-full">
                  <div
                    className="bg-orange-500 w-full rounded-t-sm"
                    style={{
                      height: `${Math.max(
                        5,
                        (data.amount / Math.max(...stats.revenueTrend.map(m => m.amount || 1))) * 200
                      )}px`
                    }}
                  ></div>
                  <div className="absolute top-0 left-0 right-0 text-center -mt-6 text-xs font-semibold text-gray-700">
                    {formatCurrency(data.amount)}
                  </div>
                </div>
                <div className="mt-2 text-xs font-medium text-gray-600">{data.month}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-orange-50 shadow-lg rounded-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Platform Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Venues</span>
              <span className="font-semibold text-gray-900">{stats.totalVenues}</span>
            </div>
            <hr />
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active Venues</span>
              <Link to="/admin/venue/fetch" className="font-semibold text-green-600">{stats.activeVenues}</Link>
            </div>
            <hr />
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pending Venues</span>
              <Link to="/admin/venue/pending" className="font-semibold text-orange-600">{stats.pendingVenues}</Link>
            </div>
            <hr />
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Blocked Venues</span>
              <span className="font-semibold text-red-600">{stats.blockedVenues}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Revenue Card */}
        <div className="shadow-lg bg-orange-50 p-5 rounded-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Total Revenue</h2>
            <FaMoneyBillAlt className="h-6 w-6 text-orange-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-orange-900">{formatCurrency(stats.totalRevenue)}</span>
            <span className="text-sm text-gray-600 mt-1">From all confirmed bookings</span>
          </div>
        </div>

        {/* Recent Bookings Card */}
        <div className="shadow-lg bg-orange-50 p-5 rounded-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Bookings</h2>
            <FaChartLine className="h-6 w-6 text-orange-600" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-2">Venue</th>
                  <th className="pb-2">User</th>
                  <th className="pb-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.length > 0 ? (
                  stats.recentBookings.map((booking) => (
                    <tr key={booking._id} className="border-b">
                      <td className="py-2 text-sm">{booking.venueName}</td>
                      <td className="py-2 text-sm">{booking.userName}</td>
                      <td className="py-2 text-sm font-medium text-orange-900">{formatCurrency(booking.amount)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-gray-500">No recent bookings</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {stats.recentBookings.length > 0 && (
            <div className="mt-3 text-right">
              <Link to="/admin/bookings" className="text-orange-600 font-medium hover:text-orange-800 text-sm">
                View All Bookings
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;