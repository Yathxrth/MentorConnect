import { useState } from 'react';
import { Bell, Trash2, MessageSquare, Award, Users, Book, Clock, LogOut } from 'lucide-react';

// Notifications Page Component
function Signup({ setCurrentPage }) {
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Mentor Response',
      message: 'Sarah Chen replied to your question about React best practices',
      time: '2 hours ago',
      icon: MessageSquare,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      title: 'Project Submission Evaluated',
      message: 'Your "E-commerce Dashboard" project received 9.2/10',
      time: '5 hours ago',
      icon: Award,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 3,
      title: 'Team Member Joined',
      message: 'Jordan Miller joined your "AI Integration" team',
      time: '1 day ago',
      icon: Users,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 4,
      title: 'Badge Earned!',
      message: 'You earned the "Quick Learner" badge',
      time: '2 days ago',
      icon: Award,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 5,
      title: 'Milestone Achievement',
      message: 'You reached 100 contributions!',
      time: '3 days ago',
      icon: Book,
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      id: 6,
      title: 'Project Deadline Reminder',
      message: 'Your "Mobile App Design" project is due in 3 days',
      time: '4 days ago',
      icon: Clock,
      color: 'bg-orange-100 text-orange-600'
    }
  ]);

  // Handle delete notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No notifications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notif => {
              const IconComponent = notif.icon;
              return (
                <div
                  key={notif.id}
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all flex gap-4"
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${notif.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900">{notif.title}</h3>
                    <p className="text-slate-600 text-sm mt-1">{notif.message}</p>
                    <p className="text-slate-400 text-xs mt-2">{notif.time}</p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="flex-shrink-0 text-slate-400 hover:text-red-600 transition-colors p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Signup;