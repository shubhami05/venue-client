import React from 'react';
import { MdTrendingUp, MdTrendingDown, MdPeople, MdHome, MdEvent, MdStar } from 'react-icons/md';

const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="p-3 bg-orange-100 rounded-lg">
        <Icon className="h-6 w-6 text-orange-600" />
      </div>
    </div>
    <div className="mt-4 flex items-center">
      {trend === 'up' ? (
        <MdTrendingUp className="h-5 w-5 text-green-500" />
      ) : (
        <MdTrendingDown className="h-5 w-5 text-red-500" />
      )}
      <span className={`ml-2 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
        {trendValue}
      </span>
      <span className="text-gray-500 ml-2">vs last month</span>
    </div>
  </div>
);

const AdminAnalytics = () => {
  // Sample data - replace with actual API data
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: MdPeople,
      trend: 'up',
      trendValue: '12%'
    },
    {
      title: 'Active Venues',
      value: '567',
      icon: MdHome,
      trend: 'up',
      trendValue: '8%'
    },
    {
      title: 'Total Bookings',
      value: '2,345',
      icon: MdEvent,
      trend: 'down',
      trendValue: '3%'
    },
    {
      title: 'Average Rating',
      value: '4.5',
      icon: MdStar,
      trend: 'up',
      trendValue: '5%'
    }
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
          <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-200 rounded">
            <p className="text-gray-500">Revenue Chart Placeholder</p>
          </div>
        </div>

        {/* Bookings Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Booking Trends</h2>
          <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-200 rounded">
            <p className="text-gray-500">Bookings Chart Placeholder</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <MdEvent className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium">New Booking</p>
                  <p className="text-xs text-gray-500">Grand Ballroom - John Doe</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics; 