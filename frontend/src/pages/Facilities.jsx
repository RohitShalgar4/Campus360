import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

function Facilities() {
  const facilities = [
    {
      id: 1,
      name: 'Main Auditorium',
      capacity: 500,
      location: 'Main Building, Ground Floor',
      availability: [
        { date: '2024-03-20', slots: ['09:00 AM - 12:00 PM', '02:00 PM - 05:00 PM'] },
        { date: '2024-03-21', slots: ['09:00 AM - 12:00 PM'] }
      ]
    },
    {
      id: 2,
      name: 'Conference Room A',
      capacity: 50,
      location: 'Library Building, 2nd Floor',
      availability: [
        { date: '2024-03-20', slots: ['10:00 AM - 11:00 AM', '03:00 PM - 04:00 PM'] },
        { date: '2024-03-21', slots: ['02:00 PM - 03:00 PM'] }
      ]
    },
    {
      id: 3,
      name: 'Sports Complex',
      capacity: 200,
      location: 'Sports Block',
      availability: [
        { date: '2024-03-20', slots: ['07:00 AM - 09:00 AM', '04:00 PM - 06:00 PM'] },
        { date: '2024-03-21', slots: ['07:00 AM - 09:00 AM'] }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">Facility Booking</h1>
        <p className="mt-2 text-gray-600">Book college facilities for your events and activities</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {facilities.map((facility) => (
          <div key={facility.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{facility.name}</h2>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-5 w-5 mr-2" />
                      <span>Capacity: {facility.capacity} people</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{facility.location}</span>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Book Now
                </button>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Available Slots</h3>
                <div className="mt-3 space-y-4">
                  {facility.availability.map((day) => (
                    <div key={day.date} className="border rounded-lg p-4">
                      <div className="flex items-center text-gray-700 mb-2">
                        <Calendar className="h-5 w-5 mr-2" />
                        <span>{day.date}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {day.slots.map((slot) => (
                          <div
                            key={slot}
                            className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-2 rounded"
                          >
                            <Clock className="h-4 w-4" />
                            <span>{slot}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Facilities;