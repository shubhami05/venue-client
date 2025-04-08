import React, { useEffect, useState } from 'react'
import { FaMoneyBill, FaQuestionCircle, FaStar, FaUserTag, FaHotel, FaCalendarCheck, FaCalendarAlt, FaSpinner, FaBuilding } from 'react-icons/fa'
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
    const [activeTab, setActiveTab] = useState('distribution');

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
                <Link to="/owner/venues" className="shadow-lg bg-orange-50 text-orange-700 p-4 rounded-md hover:bg-orange-50 transition-colors cursor-pointer hover:text-orange-900">
                    <div className='flex justify-end'>
                        <FaBuilding className='h-9 w-9 my-2' />
                    </div>
                    <div>
                        <h3 className="text-3xl font-semibold text-orange-900">{analytics.totalVenues}</h3>
                        <h3 className="text-lg font-semibold text-orange-900">Total Venues</h3>
                    </div>
                </Link>
                <Link to="/owner/bookings" className="shadow-lg bg-orange-50 text-orange-700 p-4 rounded-md hover:bg-orange-50 transition-colors cursor-pointer hover:text-orange-900">
                    <div className='flex justify-end'>
                        <FaCalendarCheck className='h-9 w-9 my-2' />
                    </div>
                    <div>
                        <h3 className="text-3xl font-semibold text-orange-900">{analytics.totalBookings}</h3>
                        <h3 className="text-lg font-semibold text-orange-900">Total Bookings</h3>
                    </div>
                </Link>



                <Link to="/owner/inquiries" className="shadow-lg bg-orange-50 text-orange-700 p-4 rounded-md hover:bg-orange-50 transition-colors cursor-pointer hover:text-orange-900">
                    <div className='flex justify-end'>
                        <FaQuestionCircle className='h-9 w-9 my-2' />
                    </div>
                    <div>
                        <h3 className="text-3xl font-semibold text-orange-900">{analytics.totalInquiries}</h3>
                        <h3 className="text-lg font-semibold text-orange-900">Total Inquiries</h3>
                    </div>
                </Link>

                <Link to="/owner/reviews" className="shadow-lg bg-orange-50 text-orange-700 p-4 rounded-md hover:bg-orange-50 transition-colors cursor-pointer hover:text-orange-900">
                    <div className='flex justify-end'>
                        <FaUserTag className='h-9 w-9 my-2' />
                    </div>
                    <div>
                        <h3 className="text-3xl font-semibold text-orange-900">{analytics.totalReviews}</h3>
                        <h3 className="text-lg font-semibold text-orange-900">Total Reviews</h3>
                    </div>
                </Link>


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
                            <span className="text-gray-600">Pending Venues</span>
                            <span className="font-semibold text-orange-600">{analytics.pendingVenues}</span>
                        </div>
                        <hr />
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Accepted Venues</span>
                            <span className="font-semibold text-green-600">{analytics.acceptedVenues}</span>
                        </div>
                        <hr />
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Rejected Venues</span>
                            <span className="font-semibold text-red-600">{analytics.rejectedVenues}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Stats - Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Rating Analytics Card */}
                <div className="shadow-lg bg-orange-50 p-5 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Rating Analytics</h2>
                        <FaStar className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Overall Average Rating</span>
                            <span className="font-semibold text-orange-900">
                                {analytics.averageRating ? analytics.averageRating || '0.0' : '0.0'} ⭐
                            </span>
                        </div>
                        <hr />
                        <div className="space-y-2">
                            <div className="flex space-x-2 mb-4">
                                <button 
                                    className={`px-3 py-1 rounded-md ${activeTab === 'distribution' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    onClick={() => setActiveTab('distribution')}
                                >
                                    Distribution
                                </button>
                                <button 
                                    className={`px-3 py-1 rounded-md ${activeTab === 'venues' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    onClick={() => setActiveTab('venues')}
                                >
                                    Venues
                                </button>
                            </div>

                            {activeTab === 'distribution' && (
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-700">Rating Distribution</h3>
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count = analytics.ratingDistribution?.[star] || 0;
                                        const maxCount = Math.max(...Object.values(analytics.ratingDistribution || {}));
                                        const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                                        
                                        return (
                                            <div key={star} className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-orange-500 font-bold">{star} ⭐</span>
                                                    <span className="font-semibold text-gray-900">{count}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {activeTab === 'venues' && (
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-700">Average Venue Ratings</h3>
                                    <div className="max-h-40 overflow-y-auto">
                                        {analytics.venueRatings?.map((venue) => {
                                            const reviewCount = analytics.ratingDistribution?.[Math.round(venue.rating)] || 0;
                                            const maxCount = Math.max(...Object.values(analytics.ratingDistribution || {}));
                                            const percentage = maxCount > 0 ? (reviewCount / maxCount) * 100 : 0;
                                            
                                            return (
                                                <div key={venue.id} className="space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-600 truncate max-w-[120px]">{venue.name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-gray-900">
                                                                {venue.rating?.toFixed(1)} ⭐
                                                            </span>
                                                            <span className="text-sm text-gray-500">({reviewCount})</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Total Revenue Card */}
                <div className="shadow-lg bg-orange-50 p-5 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Total Revenue</h2>
                        <FaMoneyBill className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold text-orange-900">{formatCurrency(analytics.totalRevenue)}</span>
                        <span className="text-sm text-gray-600 mt-1">From all completed bookings</span>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Booking Status</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Completed Bookings</span>
                                <span className="font-semibold text-green-600">{analytics.confirmedBookings}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Pending Bookings</span>
                                <span className="font-semibold text-orange-600">{analytics.pendingBookings}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Venue Activity Card */}
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
                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Review Status</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Total Reviews</span>
                                <span className="font-semibold text-gray-900">{analytics.totalReviews}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Pending Reviews</span>
                                <span className="font-semibold text-orange-600">{analytics.pendingReviews}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OwnerDashboard
