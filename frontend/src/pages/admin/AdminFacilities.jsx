import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Check, X } from 'lucide-react';

function AdminFacilities() {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      facility: 'Main Auditorium',
      date: '2024-03-20',
      slot: '09:00 AM - 12:00 PM',
      purpose: 'Annual Cultural Fest',
      status: 'pending'
    },
    {
      id: 2,
      facility: 'Conference Room A',
      date: '2024-03-21',
      slot: '02:00 PM - 03:00 PM',
      purpose: 'Department Meeting',
      status: 'pending'
    }
  ]);

  const handleApproveBooking = (id) => {
    setBookings(bookings.map(booking =>
      booking.id === id ? { ...booking, status: 'approved' } : booking
    ));
  };

  const handleRejectBooking = (id) => {
    setBookings(bookings.map(booking =>
      booking.id === id ? { ...booking, status: 'rejected' } : booking
    ));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">Facility Booking Management</h1>
        <p className="mt-2 text-gray-600">Manage and approve facility booking requests</p>
      </div>

      <div className="space-y-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{booking.facility}</h2>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>{booking.slot}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span>Purpose: {booking.purpose}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => handleApproveBooking(booking.id)}
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => handleRejectBooking(booking.id)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  {booking.status === 'approved' && (
                    <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded">
                      Approved
                    </span>
                  )}
                  {booking.status === 'rejected' && (
                    <span className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded">
                      Rejected
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminFacilities;