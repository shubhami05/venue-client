import React, { useState, useRef, useEffect } from 'react';
import { Send, X, HelpCircle, ChevronRight, Search } from 'lucide-react';

/**
 * OwnerHelpChatbot - A specialized chatbot for the GetHelp page that assists venue owners
 * with common questions and guides them through website functionality
 */
const OwnerHelpChatbot = () => {
  const [isOpen, setIsOpen] = useState(true); // Start open on the help page
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: 'Welcome to VenueServ Support! I\'m here to help you manage your venue effectively. What would you like assistance with today?' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
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
      "How do I register as a venue owner?",
      "What documents do I need for verification?",
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
      "How do I accept or reject a booking?",
      "Can I set custom availability for my venue?",
      "How do I handle cancellations?"
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
    
    // "How do I register as a venue owner?": 
    //   "To register as a venue owner: 1) Click 'Become a Host' on the homepage, 2) Create your account with email and password, " +
    //   "3) Fill out the business information form, 4) Upload verification documents (business license, ID proof, etc.), " +
    //   "5) Complete your profile with contact details, 6) Set up payment information, 7) Verify your email and phone number. " +
    //   "Once completed, our team will review your application within 2-3 business days.",
    
    // "What documents do I need for verification?": 
    //   "For venue owner verification, you'll need to provide: a valid government-issued ID (passport or driver's license), " +
    //   "proof of business ownership (business license, registration certificate, or incorporation documents), proof of address " +
    //   "(utility bill or bank statement from the last 3 months), and tax identification information. For certain venue types, " +
    //   "additional licenses or permits may be required depending on your location.",
    
    "How long does venue verification take?": 
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
    
    "How do I view bookings?": 
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
      "VenueServ operates on a simple fee structure: we charge venue owners 10% of each booking value. This commission covers payment processing, " +
      "platform maintenance, customer service, marketing of your venue, and our booking management system. There are no monthly fees or " +
      "listing fees - you only pay when you earn. Premium features like promoted listings or professional photography services may incur " +
      "additional costs, but these are entirely optional and clearly communicated before you opt in."
  };

  // Function to handle category selection
  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
  };

  // Function to handle clicking a help topic
  const handleTopicClick = (topic) => {
    setMessages(prev => [...prev, { sender: 'user', text: topic }]);
    
    // Add bot response after a short delay
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: answers[topic] || "I don't have specific information on that topic yet. Please contact our support team at help.venueserv@gmail.com for assistance."
      }]);
    }, 500);
  };

  // Function to handle sending a custom message
  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;
    
    const userQuestion = inputMessage;
    setMessages(prev => [...prev, { sender: 'user', text: userQuestion }]);
    setInputMessage('');
    
    // Check if the question matches any known answer by keywords
    const matchTopic = Object.keys(answers).find(topic => 
      userQuestion.toLowerCase().includes(topic.toLowerCase().substring(0, 10))
    );
    
    setTimeout(() => {
      if (matchTopic) {
        setMessages(prev => [...prev, { sender: 'bot', text: answers[matchTopic] }]);
      } else {
        setMessages(prev => [...prev, { 
          sender: 'bot', 
          text: "Thanks for your question. I don't have a specific answer for that yet. For personalized assistance, please email owners@venueserv.com or call our support team at (555) 123-4567." 
        }]);
      }
    }, 600);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full max-h-[800px] flex flex-col">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Venue Owner Support</h2>
          <p className="text-indigo-100 text-sm">Get help managing your venues</p>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="rounded-full p-1 hover:bg-indigo-700 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with categories */}
        <div className="w-1/4 bg-gray-50 border-r border-gray-200 overflow-y-auto">
          <div className="p-3">
            <div className="relative mb-3">
              <input 
                type="text" 
                placeholder="Search help topics..." 
                className="w-full p-2 pl-8 text-sm border border-gray-300 rounded-md"
              />
              <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
            </div>
            
            <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">Help Categories</h3>
            <ul>
              {categories.map(category => (
                <li key={category.id}>
                  <button
                    onClick={() => handleCategorySelect(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center ${
                      activeCategory === category.id 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'hover:bg-gray-100'
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
        <div className="w-3/4 flex flex-col">
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-3/4 p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Topic suggestions */}
          <div className="p-3 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Suggested topics in {categories.find(c => c.id === activeCategory)?.name}:</p>
            <div className="flex flex-wrap gap-2">
              {helpTopics[activeCategory].map((topic, index) => (
                <button 
                  key={index}
                  onClick={() => handleTopicClick(topic)}
                  className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 hover:bg-indigo-50 hover:border-indigo-300 text-gray-700"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
          
          {/* Input area */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your question..."
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button 
                onClick={handleSendMessage}
                className="bg-indigo-600 text-white p-2 rounded-r-md hover:bg-indigo-700"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerHelpChatbot;