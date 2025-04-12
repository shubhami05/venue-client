import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, ChevronRight } from 'lucide-react';

/**
 * OwnerHelpChatbot - A specialized chatbot for the GetHelp page that assists venue owners
 * with common questions and guides them through website functionality
 */
const OwnerHelpChatbot = () => {
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: 'Welcome to VenueServ Support! I\'m here to help you manage your venue effectively. What would you like assistance with today?' 
    }
  ]);
  const [activeCategory, setActiveCategory] = useState('general');
  const messagesEndRef = useRef(null);

  // Categories of help topics for venue owners
  const categories = [
    { id: 'general', name: 'General', icon: <HelpCircle size={18} /> },
    { id: 'registration', name: 'Registration', icon: <ChevronRight size={18} /> },
    { id: 'venues', name: 'Managing Venues', icon: <ChevronRight size={18} /> },
    { id: 'bookings', name: 'Bookings', icon: <ChevronRight size={18} /> },
    { id: 'payments', name: 'Payments', icon: <ChevronRight size={18} /> },
  ];

  // Help topics organized by category
  const helpTopics = {
    general: [
      "How do I get started as a venue owner?",
      "What are the benefits of listing on VenueServ?",
      "How do I contact customer support?",
      "What types of venues can I list?"
    ],
    registration: [
      "How long does verification take?",
      "Can I manage multiple venues under one account?"
    ],
    venues: [
      "How do I add a new venue?",
      "How do I update my venue details?",
      "How do I set pricing for my venue?"
    ],
    bookings: [
      "How do I view booking requests?",
      "Can I set custom availability for my venue?"
    ],
    payments: [
      "How do payouts work?",
      "When will I receive payment for bookings?",
      "How do I set up my payment details?",
      "What fees does VenueServ charge?"
    ]
  };

  // Comprehensive answers to common questions
  const answers = {
    "How do I get started as a venue owner?": 
      "Getting started on VenueServ is easy! First, set-up your stripe account for payout on the profile page. " +
      "Complete the verification process by providing required details. Once verified, you can add your venues, set pricing " +
      "and start receiving booking requests. Our step-by-step onboarding process will guide you through each stage which is in profile section.",
    
    "What are the benefits of listing on VenueServ?": 
      "VenueServ offers numerous benefits including: exposure to thousands of potential clients, a secure payment system, " +
      "powerful booking management tools, professional listing pages with photo galleries, calendar management, automated " +
      "notifications, review collection from clients, and 24/7 support from our dedicated team. We handle the marketing and " +
      "booking logistics so you can focus on providing excellent venues.",
    
    "How do I contact customer support?": 
      "You can reach our dedicated venue owner support team through multiple channels: send an email to help.venueserv@gmail.com, " +
      "use the 'Contact Support' button in your dashboard, call our owner hotline at 9924457873 during business hours " +
      "(Mon-Fri, 9am-6pm), or schedule a video call with a venue success manager for personalized assistance.",
    
    "What types of venues can I list?": 
      "VenueServ supports a wide variety of venues including: banquet halls, conference rooms, wedding venues, " +
      "photography studios, party spaces, outdoor areas, theaters, auditoriums, sports facilities, and unique specialty venues. " +
      "If you're unsure if your space qualifies, contact our support team who can help determine if it's a good fit for our platform.",
    
    "How long does verification take?": 
      "The verification process typically takes 2-3 business days once all required documents are submitted. During peak seasons, " +
      "it may take up to 5 business days. You'll receive email updates at each stage of the verification process. If there are any " +
      "issues with your documentation, our team will contact you promptly with specific guidance on what needs to be corrected.",
    
    "Can I manage multiple venues under one account?": 
      "Yes, you can manage multiple venues under a single owner account. After your initial setup and verification, you can add " +
      "additional venues by going to your Dashboard > Venues > Add New Venue. Each venue can have its own details, pricing, " +
      "availability schedule, and photo gallery. Our multi-venue management tools make it easy to keep track of bookings and " +
      "manage all your spaces efficiently.",
    
    "How do I add a new venue?": 
      "To add a new venue: 1) Log in to your owner dashboard, 2) Click on 'Venues' in the sidebar menu, 3) Select 'Add New Venue', " +
      "4) Complete the venue details form with name, address, description, amenities, and capacity, 5) Set pricing and availability, " +
      "6) Upload high-quality photos (at least 5 recommended), 7) Review and publish your listing. Once we verify details your venue " +
      "will be ready to book in our platform.",
    
    "How do I update my venue details?": 
      "To update venue details: 1) Go to your Owner Dashboard, 2) Select 'Venues' from the sidebar, 3) Choose the venue you want to update, " +
      "4) Click 'Edit' next to any venue you wish to modify (Basic Info, Details, Amenities, Photos, Pricing, or Availability), " +
      "5) Make your changes, 6) Click 'Save Changes'. Updates will be reflected immediately on your listing page. Remember to keep your " +
      "venue information current, especially any changes to amenities or policies.",
    
    "How do I set pricing for my venue?": 
      "To set pricing: 1) Access your Owner Dashboard > Venues > Select your venue > Pricing, 2) Set your 'Without Food' pricing for morning, evening, and full-day options, " +
      "3) If you offer food services, configure 'With Food' pricing options (per person rates for morning, evening, and full-day), " +
      "4) Specify food options by indicating whether outside food is allowed and if food is provided by your venue, " +
      "5) Set your booking payment amount (required for reservations), " +
      "6) Configure decoration options by indicating if outside decorators are allowed and if decoration services are provided by your venue, " +
      "7) Save your settings. All pricing changes affect new bookings only - existing confirmed bookings will maintain their original rates.",
    
    "How do I view booking requests?": 
      "To view booking requests: 1) Log in to your Owner Dashboard, 2) Click 'Bookings' in the main navigation, 3) The default view shows " +
      "all bookings, 4) Click on any booking to see full details including date, time, client information, " +
      "and any other details 5) You can filter bookings by status (Pending, Confirmed, Cancelled), date or venue.",
    
    "How do payouts work?": 
      "VenueServ processes payouts as follows: 1) When a client books your venue, the payment is securely held by VenueServ, 2) After the event " +
      "is completed, there's a 24-hour review period, 3) Assuming no disputes, the payment (minus our service fee) is released to your " +
      "account, 4) Depending on your payout method, funds typically appear in your account within 3-5 business days. For high-volume hosts, " +
      "we offer weekly automatic payouts. You can view all payout records in your dashboard.",
    
    "When will I receive payment for bookings?": 
      "Payments are released to your account within 24 hours the booking end time, provided there are no open disputes. The funds will then be " +
      "transferred to your bank account according to your selected payout schedule: Standard (3-5 business days), Express (1-2 business days, " +
      "additional fee applies), or Weekly automatic payouts (available for established hosts). You'll receive notification emails when " +
      "payouts are initiated and completed.",
    
    "How do I set up my payment details?": 
      "To set up payment details: 1) Go to Dashboard > Profile > Payment Settings, 2) Click 'Update Stripe Account', 3) Enter the required banking information, 4) Verify " +
      "your account through the secure verification process, 5) Set your preferred payout frequency if multiple options are available. " +
      "All payment information is encrypted and securely stored in compliance with financial regulations.",
    
    "What fees does VenueServ charge?": 
      "VenueServ operates on a simple fee structure: we charge venue owners 3% of each booking value. This commission covers payment processing, " +
      "platform maintenance, customer service, marketing of your venue, and our booking management system. There are no monthly fees or " +
      "listing fees - you only pay when you earn. Premium features like promoted listings or professional photography services may incur " +
      "additional costs, but these are entirely optional and clearly communicated before you opt in.",
    
    "Can I set custom availability for my venue?":
      "Yes, your venue's availability is managed through our reservation system: 1) When a customer books your venue, those dates are automatically marked as unavailable in the system, 2) You can view all upcoming reservations in your Dashboard > Bookings section, 3) The system prevents double-bookings by not showing already-reserved time slots to other potential customers, 4) If you need to block specific dates when your venue is unavailable (for maintenance, private events, etc.), you can create a reservation for those dates through your owner account, 5) Our system handles morning, evening, and full-day bookings separately, so you can still accept morning bookings even if evenings are reserved. This reservation-based availability management ensures your venue is never double-booked and gives you full visibility of your schedule."
  };

  // Function to handle category selection
  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
  };

  // Function to handle clicking a help topic
  const handleTopicClick = (topic) => {
    setMessages(prev => [...prev, { sender: 'user', text: topic }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: answers[topic] || "I don't have specific information on that topic yet. Please contact our support team at support@venueserv.com for assistance."
      }]);
    }, 500);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-orange-100  px-2 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
          <div className="bg-inherit text-orange-900 p-4 sm:p-6">
            <h2 className="text-2xl sm:text-3xl font-bold">Venue Owner Support</h2>
            <p className="text-orange-900 mt-1 text-sm sm:text-base">Get help managing your venues</p>
          </div>
        <div className="rounded-xl shadow-lg overflow-hidden">

          
          <div className="flex bg-white shadow-lg rounded-lg flex-col md:flex-row h-[500px] sm:h-[600px]">
            {/* Sidebar with categories */}
            <div className="w-full md:w-1/4 border-r border-orange-200 overflow-y-auto custom-scrollbar">
              <div className="p-3 sm:p-4">
                <h3 className="text-xs sm:text-sm font-semibold uppercase text-orange-600 mb-2 sm:mb-3">Help Categories</h3>
                <ul className="space-y-1">
                  {categories.map(category => (
                    <li key={category.id}>
                      <button
                        onClick={() => handleCategorySelect(category.id)}
                        className={`w-full text-left px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm flex items-center transition-colors ${
                          activeCategory === category.id 
                            ? 'bg-orange-100 text-orange-700 font-medium' 
                            : 'hover:bg-orange-50 text-orange-900'
                        }`}
                      >
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Main chat area */}
            <div className="w-full md:w-3/4 flex flex-col">
              {/* Messages */}
              <div className="flex-1 p-3 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4 custom-scrollbar">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[90%] sm:max-w-[80%] p-3 sm:p-4 rounded-xl text-sm sm:text-base ${
                        message.sender === 'user' 
                          ? 'bg-orange-600 text-white rounded-tr-none' 
                          : 'bg-orange-50 text-orange-900 rounded-tl-none'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Topic suggestions */}
              <div className="p-3 sm:p-4 bg-orange-50 border-t border-orange-200">
                <p className="text-xs sm:text-sm font-medium text-orange-600 mb-2 sm:mb-3">
                  Suggested topics in {categories.find(c => c.id === activeCategory)?.name}:
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {helpTopics[activeCategory].map((topic, index) => (
                    <button 
                      key={index}
                      onClick={() => handleTopicClick(topic)}
                      className="text-xs sm:text-sm bg-white border border-orange-300 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 hover:bg-orange-50 hover:border-orange-400 text-orange-700 transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #fff5f5;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fb923c;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ea580c;
        }
      `}</style>
    </div>
  );
};

export default OwnerHelpChatbot;