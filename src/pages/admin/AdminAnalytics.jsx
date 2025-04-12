import React, { useState, useEffect } from 'react';
import { FaUsers, FaBuilding, FaCalendarCheck, FaMoneyBillAlt, FaStar, FaUserTie, FaChartLine, FaSpinner, FaCreditCard, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, BarChart, Bar } from 'recharts';
import { ResponsiveContainer } from 'recharts';

const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOwners: 0,
    totalVenues: 0,
    totalBookings: 0,
    totalRevenue: 0,
    platformFee: 0,
    pendingVenues: 0,
    pendingOwners: 0,
    totalReviews: 0,
    totalInquiries: 0,
    activeVenues: 0,
    blockedVenues: 0,
    recentBookings: [],
    revenueTrend: [],
    recentReviews: [],
    paymentStats: {
      totalPayments: 0,
      successfulPayments: 0,
      failedPayments: 0,
      averagePaymentAmount: 0
    },
    revenueByVenue: []
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
          platformFee: response.data.platformFee || 0,
          pendingVenues: response.data.pendingVenues || 0,
          activeVenues: response.data.activeVenues || 0,
          blockedVenues: response.data.blockedVenues || 0,
          recentBookings: response.data.recentBookings || [],
          revenueTrend: response.data.revenueTrend || [],
          recentReviews: response.data.recentReviews || [],
          totalReviews: response.data.totalReviews || 0,
          totalInquiries: response.data.totalInquiries || 0,
          pendingOwners: response.data.pendingOwners || 0,
          paymentStats: {
            totalPayments: response.data.paymentStats?.totalPayments || 0,
            successfulPayments: response.data.paymentStats?.successfulPayments || 0,
            failedPayments: response.data.paymentStats?.failedPayments || 0,
            averagePaymentAmount: response.data.paymentStats?.averagePaymentAmount || 0
          },
          revenueByVenue: response.data.revenueByVenue || []
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
        <Link to="/admin/users" className="shadow-lg bg-orange-50 text-orange-700 p-4 rounded-md hover:bg-orange-100 transition-colors cursor-pointer hover:text-orange-900">
          <div className="flex justify-end">
            <FaUsers className="h-9 w-9 my-2" />
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-orange-900">{stats.totalUsers}</h3>
            <h3 className="text-lg font-semibold text-orange-900">Total Users</h3>
          </div>
        </Link>

        <Link to="/admin/bookings" className="shadow-lg bg-orange-50 text-orange-700 hover:text-orange-900 p-4 rounded-md hover:bg-orange-100 transition-colors cursor-pointer">
          <div className="flex justify-end">
            <FaCalendarCheck className="h-9 w-9 my-2" />
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-orange-900">{stats.totalBookings}</h3>
            <h3 className="text-lg font-semibold text-orange-900">Total Bookings</h3>
          </div>
        </Link>

        <Link to="/admin/venues" className="shadow-lg bg-orange-50 text-orange-700 hover:text-orange-900 p-4 rounded-md hover:bg-orange-100 transition-colors cursor-pointer">
          <div className="flex justify-end">
            <FaBuilding className="h-9 w-9 my-2" />
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-orange-900">{stats.totalVenues}</h3>
            <h3 className="text-lg font-semibold text-orange-900">Total Venues</h3>
          </div>
        </Link>

        <Link to="/admin/owners" className="shadow-lg bg-orange-50 text-orange-700 hover:text-orange-900 p-4 rounded-md hover:bg-orange-100 transition-colors cursor-pointer">
          <div className="flex justify-end">
            <FaUserTie className="h-9 w-9 my-2" />
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-orange-900">{stats.totalOwners}</h3>
            <h3 className="text-lg font-semibold text-orange-900">Total Owners</h3>
          </div>
        </Link>
      </div>

      {/* Middle Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-orange-50 shadow-lg rounded-md p-6 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold text-orange-900 mb-4">Booking Trend</h2>
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
                  <div className="absolute top-0 left-0 right-0 text-center -mt-6 text-xs font-semibold text-orange-900">
                    {formatCurrency(data.amount)}
                  </div>
                </div>
                <div className="mt-2 text-xs font-medium text-orange-900">{data.month}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-orange-50 shadow-lg rounded-md p-6">
          <h2 className="text-xl font-semibold text-orange-900 mb-4">Platform Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-orange-900">Pending Venues</span>
              <Link to="/admin/venue/pending" className="font-semibold text-orange-600 hover:text-orange-800">{stats.pendingVenues>0 ? stats.pendingVenues : 0}</Link>
            </div>
            <hr className="border-orange-200" />
            <div className="flex items-center justify-between">
              <span className="text-orange-900">Pending Owners</span>
              <Link to="/admin/owner/pending" className="font-semibold text-orange-600 hover:text-orange-800">{stats.pendingOwners>0 ? stats.pendingOwners : 0}</Link>
            </div>
            <hr className="border-orange-200" />
            <div className="flex items-center justify-between">
              <span className="text-orange-900">Total Reviews</span>
              <Link to="/admin/reviews" className="font-semibold text-orange-600 hover:text-orange-800">{stats.totalReviews>0 ? stats.totalReviews : 0}</Link>
            </div>
            <hr className="border-orange-200" />
            <div className="flex items-center justify-between">
              <span className="text-orange-900">Total Inquiries</span>
              <Link to="/admin/inquiries" className="font-semibold text-orange-600 hover:text-orange-800">{stats.totalInquiries>0 ? stats.totalInquiries : 0}</Link>
            </div>
            <hr className="border-orange-200" />
          </div>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="bg-orange-50 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4 text-orange-900">Revenue Trend</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e06422" opacity={0.2} />
              <XAxis dataKey="month" stroke="#e06422" />
              <YAxis yAxisId="left" stroke="#e06422" />
             
              <Tooltip 
                formatter={(value, name) => {
                 
                  return [formatCurrency(value), name];
                }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e06422',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
             
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="platformFee" 
                name="Platform Income" 
                stroke="#e06422" 
                strokeWidth={2}
                dot={{ r: 4, fill: '#e06422' }}
              />
            
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        {/* Revenue Card */}
        <div className="shadow-lg bg-orange-50 p-5 rounded-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-orange-900">Total Revenue</h2>
            <FaMoneyBillAlt className="h-6 w-6 text-orange-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-orange-900">{formatCurrency(stats.platformFee)}</span>
            <span className="text-sm text-orange-700 mt-1">From all confirmed bookings</span>
            <div className="mt-4 space-y-2">
              {stats.recentBookings.slice(0, 3).map((booking) => (
                <div key={booking._id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <FaBuilding className="text-orange-600" />
                    <span className="text-orange-900">{booking.venueName}</span>
                  </div>
                  <span className="font-medium text-orange-900">{formatCurrency(booking.platformFee)}</span>
                </div>
              ))}
              {stats.recentBookings.length > 3 && (
                <Link to="/admin/bookings" className="text-sm text-orange-600 hover:text-orange-800">
                  View all {stats.recentBookings.length} bookings
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Recent Reviews Card */}
        <div className="shadow-lg bg-orange-50 p-5 rounded-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-orange-900">Recent Reviews</h2>
            <FaStar className="h-6 w-6 text-orange-600" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-orange-700 border-b border-orange-200">
                  <th className="pb-2">Venue</th>
                  <th className="pb-2">User</th>
                  <th className="pb-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentReviews?.length > 0 ? (
                  stats.recentReviews.map((review) => (
                    <tr key={review._id} className="border-b border-orange-200">
                      <td className="py-2 text-sm text-orange-900">{review.venueName}</td>
                      <td className="py-2 text-sm text-orange-900">{review.userName}</td>
                      <td className="py-2 text-sm">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, index) => (
                            <FaStar
                              key={index}
                              className={`h-4 w-4 ${
                                index < review.rating ? 'text-orange-400' : 'text-orange-200'
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                     
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-orange-700">No recent reviews</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {stats.recentReviews?.length > 0 && (
            <div className="mt-3 text-right">
              <Link to="/admin/reviews" className="text-orange-600 font-medium hover:text-orange-800 text-sm">
                View All Reviews
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;