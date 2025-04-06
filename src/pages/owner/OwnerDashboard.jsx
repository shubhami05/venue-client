import React, { useEffect, useState } from 'react'
import { FaMoneyBill, FaQuestionCircle, FaStar, FaUserTag, FaHotel, FaCalendarCheck, FaCalendarAlt, FaSpinner } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Loader from '../../components/Loader'

const OwnerDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [analytics, setAnalytics] = useState({
        totalVenues: 0,
        totalBookings: 0,
        totalRevenue: 0,
        totalInquiries: 0,
        totalReviews: 0,
        averageRating: 0,
        pendingReviews: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        monthlyBookings: []
    });

    // Fetch dashboard analytics data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('/api/owner/dashboard/analytics');
                
                if (response.data.success) {
                    setAnalytics(response.data.data);
                } else {
                    toast.error(response.data.message || 'Failed to fetch dashboard data');
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                toast.error('Failed to fetch dashboard data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className='xl:container xl:mx-auto bg-orange-100 min-h-screen px-2 py-10'>
            <h1 className="text-2xl sm:text-3xl font-bold text-orange-900 mb-8 px-4">
                Dashboard Overview
            </h1>
            
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="shadow-lg bg-orange-50 text-orange-700 p-4 rounded-md">
                    <div className='flex justify-end'>
                        <FaCalendarCheck className='h-9 w-9 my-2' />
                    </div>
                    <div>
                        <h3 className="text-3xl font-semibold text-orange-900">{analytics.totalBookings}</h3>
                        <h3 className="text-lg font-semibold text-orange-900">Total Bookings</h3>
                    </div>
                </div>
                
                
                
                <Link to="/owner/inquiries" className="shadow-lg bg-orange-50 text-orange-700 p-4 rounded-md hover:bg-orange-50 transition-colors cursor-pointer">
                    <div className='flex justify-end'>
                        <FaQuestionCircle className='h-9 w-9 my-2' />
                    </div>
                    <div>
                        <h3 className="text-3xl font-semibold text-orange-900">{analytics.totalInquiries}</h3>
                        <h3 className="text-lg font-semibold text-orange-900">Total Inquiries</h3>
                    </div>
                </Link>

                <Link to="/owner/reviews" className="shadow-lg bg-orange-50 text-orange-700 p-4 rounded-md hover:bg-orange-50 transition-colors cursor-pointer">
                    <div className='flex justify-end'>
                        <FaUserTag className='h-9 w-9 my-2' />
                    </div>
                    <div>
                        <h3 className="text-3xl font-semibold text-orange-900">{analytics.totalReviews}</h3>
                        <h3 className="text-lg font-semibold text-orange-900">Total Reviews</h3>
                    </div>
                </Link>
                
                <div className="shadow-lg bg-orange-50 text-orange-700 p-4 rounded-md">
                    <div className='flex justify-end'>
                        <FaStar className='h-9 w-9 my-2' />
                    </div>
                    <div>
                        <h3 className="text-3xl font-semibold text-orange-900">{analytics.averageRating}</h3>
                        <h3 className="text-lg font-semibold text-orange-900">Average Rating</h3>
                    </div>
                </div>
            </div>
            
            {/* Middle Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-orange-50 shadow-lg rounded-md p-6 col-span-1 md:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Bookings</h2>
                    <div className="h-64 flex items-end justify-between space-x-2">
                        {analytics.monthlyBookings.map((item, index) => (
                            <div key={index} className="flex flex-col items-center flex-1">
                                <div className="relative w-full">
                                    <div 
                                        className="bg-orange-500 w-full rounded-t-sm" 
                                        style={{ 
                                            height: `${Math.max(
                                                5, 
                                                (item.count / Math.max(...analytics.monthlyBookings.map(m => m.count))) * 200
                                            )}px` 
                                        }}
                                    ></div>
                                    <div className="absolute top-0 left-0 right-0 text-center -mt-6 text-xs font-semibold text-gray-700">
                                        {item.count}
                                    </div>
                                </div>
                                <div className="mt-2 text-xs font-medium text-gray-600">{item.month}</div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-orange-50 shadow-lg rounded-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Properties</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Total Venues</span>
                            <span className="font-semibold text-gray-900">{analytics.totalVenues}</span>
                        </div>
                        <hr />
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Pending Reviews</span>
                            <Link to="/owner/reviews" className="font-semibold text-orange-600">{analytics.pendingReviews}</Link>
                        </div>
                        <hr />
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Pending Bookings</span>
                            <Link to="/owner/bookings" className="font-semibold text-orange-600">{analytics.pendingBookings}</Link>
                        </div>
                        <hr />
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Confirmed Bookings</span>
                            <Link to="/owner/bookings" className="font-semibold text-green-600">{analytics.confirmedBookings}</Link>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Revenue Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="shadow-lg bg-orange-50 p-5 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Total Revenue</h2>
                        <FaMoneyBill className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold text-orange-900">{formatCurrency(analytics.totalRevenue)}</span>
                        <span className="text-sm text-gray-600 mt-1">From all confirmed bookings</span>
                    </div>
                </div>
                
                <div className="shadow-lg bg-orange-50 p-5 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Recent Venue Activity</h2>
                        <FaHotel className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Last Month Bookings</span>
                            <span className="font-semibold text-gray-900">
                                {analytics.monthlyBookings.length > 0 ? analytics.monthlyBookings[analytics.monthlyBookings.length - 1].count : 0}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Last Month Revenue</span>
                            <span className="font-semibold text-gray-900">
                                {analytics.monthlyBookings.length > 0 ? 
                                    formatCurrency(analytics.monthlyBookings[analytics.monthlyBookings.length - 1].revenue) : 
                                    formatCurrency(0)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OwnerDashboard
