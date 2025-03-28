import React, { useState, useEffect } from 'react';
import { MdPeople, MdBusiness, MdEvent, MdAttachMoney, MdTrendingUp, MdTrendingDown } from 'react-icons/md';
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
        setStats(response.data);
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

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard Analytics</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Users */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <h3 className="text-2xl font-semibold">{stats.totalUsers}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <MdPeople className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Venues */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Venues</p>
              <h3 className="text-2xl font-semibold">{stats.totalVenues}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <MdBusiness className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Bookings</p>
              <h3 className="text-2xl font-semibold">{stats.totalBookings}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <MdEvent className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-semibold">₹{stats.totalRevenue}</h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <MdAttachMoney className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Venue Status Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Venue Status</h3>
            <MdTrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active</span>
              <span className="font-semibold">{stats.activeVenues}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending</span>
              <span className="font-semibold">{stats.pendingVenues}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Blocked</span>
              <span className="font-semibold">{stats.blockedVenues}</span>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow p-4 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th className="pb-2">Venue</th>
                  <th className="pb-2">User</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((booking) => (
                  <tr key={booking._id} className="border-t">
                    <td className="py-2">{booking.venueName}</td>
                    <td className="py-2">{booking.userName}</td>
                    <td className="py-2">{new Date(booking.date).toLocaleDateString()}</td>
                    <td className="py-2">₹{booking.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Revenue Trend</h3>
          <MdTrendingUp className="h-5 w-5 text-green-500" />
        </div>
        <div className="h-64 flex items-end justify-between">
          {stats.revenueTrend.map((data, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="w-8 bg-green-500 rounded-t"
                style={{ height: `${(data.amount / stats.totalRevenue) * 100}%` }}
              />
              <span className="mt-2 text-sm text-gray-500">{data.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics; 