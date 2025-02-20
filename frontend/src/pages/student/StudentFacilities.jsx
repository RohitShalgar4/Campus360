import React, { useState, useCallback, useMemo } from 'react';
import { Calendar, Clock, MapPin, Users, Search, Filter, AlertCircle } from 'lucide-react';

const INITIAL_FACILITIES = [
  {
    id: 1,
    name: 'Main Auditorium',
    capacity: 500,
    location: 'Main Building, Ground Floor',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1000',
    requirements: [
      { id: 'schedule', label: 'Event Schedule', type: 'file', required: true },
      { id: 'technical', label: 'Technical Requirements', type: 'text', required: true },
      { id: 'deposit', label: 'Security Deposit Amount', type: 'number', required: true },
      { id: 'attendees', label: 'Expected Number of Attendees', type: 'number', required: true }
    ],
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
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=1000',
    requirements: [
      { id: 'agenda', label: 'Meeting Agenda', type: 'text', required: true },
      { id: 'duration', label: 'Duration (hours)', type: 'number', required: true, max: 2 },
      { id: 'department', label: 'Department Name', type: 'text', required: true },
      { id: 'approval', label: 'Department Head Approval Letter', type: 'file', required: true }
    ],
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
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000',
    requirements: [
      { id: 'equipment', label: 'Equipment List', type: 'text', required: true },
      { id: 'waiver', label: 'Safety Waiver Form', type: 'file', required: true },
      { id: 'instructor', label: 'Instructor Name', type: 'text', required: true },
      { id: 'participants', label: 'Number of Participants', type: 'number', required: true }
    ],
    availability: [
      { date: '2024-03-20', slots: ['07:00 AM - 09:00 AM', '04:00 PM - 06:00 PM'] },
      { date: '2024-03-21', slots: ['07:00 AM - 09:00 AM'] }
    ]
  }
];

function StudentFacilities() {
  const [facilities] = useState(INITIAL_FACILITIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState('all');
  const [bookingHistory, setBookingHistory] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingPurpose, setBookingPurpose] = useState('');
  const [requirementInputs, setRequirementInputs] = useState({});

  const filteredFacilities = useMemo(() => {
    return facilities.filter(facility => {
      const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCapacity = selectedCapacity === 'all' ||
                           (selectedCapacity === 'small' && facility.capacity <= 50) ||
                           (selectedCapacity === 'medium' && facility.capacity > 50 && facility.capacity <= 200) ||
                           (selectedCapacity === 'large' && facility.capacity > 200);
      return matchesSearch && matchesCapacity;
    });
  }, [facilities, searchTerm, selectedCapacity]);

  const handleBookingRequest = useCallback((facility, slot) => {
    setSelectedFacility(facility);
    setSelectedSlot(slot);
    setShowBookingForm(true);
    setRequirementInputs({});
  }, []);

  const handleRequirementChange = useCallback((requirementId, value) => {
    setRequirementInputs(prev => ({
      ...prev,
      [requirementId]: value
    }));
  }, []);

  const isFormValid = useCallback(() => {
    if (!bookingPurpose.trim()) return false;
    if (!selectedFacility) return false;

    return selectedFacility.requirements.every(req => {
      const value = requirementInputs[req.id];
      if (req.required) {
        if (req.type === 'number') {
          return value && !isNaN(value) && value > 0 && (!req.max || value <= req.max);
        }
        return value && value.trim() !== '';
      }
      return true;
    });
  }, [selectedFacility, requirementInputs, bookingPurpose]);

  const submitBooking = useCallback(() => {
    if (!isFormValid()) {
      alert('Please fill in all required fields correctly');
      return;
    }

    const newBooking = {
      id: Date.now(),
      facilityId: selectedFacility.id,
      facilityName: selectedFacility.name,
      date: selectedSlot.split(' ')[0],
      slot: selectedSlot,
      purpose: bookingPurpose,
      requirements: requirementInputs,
      status: 'pending'
    };

    setBookingHistory(prev => [newBooking, ...prev]);
    setShowBookingForm(false);
    setBookingPurpose('');
    setSelectedFacility(null);
    setSelectedSlot(null);
    setRequirementInputs({});
  }, [selectedFacility, selectedSlot, bookingPurpose, requirementInputs, isFormValid]);

  const closeBookingForm = useCallback(() => {
    setShowBookingForm(false);
    setBookingPurpose('');
    setSelectedFacility(null);
    setSelectedSlot(null);
    setRequirementInputs({});
  }, []);

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search facilities..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 h-5 w-5" />
            <select
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={selectedCapacity}
              onChange={(e) => setSelectedCapacity(e.target.value)}
            >
              <option value="all">All Capacities</option>
              <option value="small">Small (&lt;50)</option>
              <option value="medium">Medium (50-200)</option>
              <option value="large">Large (&gt;200)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Booking History */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">My Booking History</h2>
        {bookingHistory.length === 0 ? (
          <div className="text-gray-500 text-center py-4">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>No booking history yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookingHistory.map((booking) => (
              <div key={booking.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{booking.facilityName}</h3>
                    <p className="text-sm text-gray-600">{booking.date} | {booking.slot}</p>
                    <p className="text-sm text-gray-600">Purpose: {booking.purpose}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Facilities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((facility) => (
          <div key={facility.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={facility.image}
              alt={facility.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
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

              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">Available Slots</h3>
                <div className="mt-3 space-y-4">
                  {facility.availability.map((day) => (
                    <div key={day.date} className="border rounded-lg p-4">
                      <div className="flex items-center text-gray-700 mb-2">
                        <Calendar className="h-5 w-5 mr-2" />
                        <span>{day.date}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {day.slots.map((slot) => (
                          <div
                            key={slot}
                            className="flex items-center justify-between space-x-2 text-sm text-gray-600 bg-gray-50 p-2 rounded"
                          >
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>{slot}</span>
                            </div>
                            <button
                              className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                              onClick={() => handleBookingRequest(facility, `${day.date} ${slot}`)}
                            >
                              Request Booking
                            </button>
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

      {/* Booking Form Modal */}
        {showBookingForm && selectedFacility && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Book Facility</h2>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">{selectedFacility.name}</p>
                  <p className="text-sm text-gray-600">{selectedSlot}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Booking Purpose
                  </label>
                  <textarea
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                    value={bookingPurpose}
                    onChange={(e) => setBookingPurpose(e.target.value)}
                    placeholder="Enter the purpose of your booking..."
                  />
                </div>

                {/* Requirements Input Section */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Facility Requirements</h3>
                  {selectedFacility.requirements.map((req) => (
                    <div key={req.id} className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        {req.label}
                        {req.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {req.type === 'text' && (
                        <input
                          type="text"
                          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={requirementInputs[req.id] || ''}
                          onChange={(e) => handleRequirementChange(req.id, e.target.value)}
                          placeholder={`Enter ${req.label.toLowerCase()}`}
                        />
                      )}
                      {req.type === 'number' && (
                        <input
                          type="number"
                          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={requirementInputs[req.id] || ''}
                          onChange={(e) => handleRequirementChange(req.id, e.target.value)}
                          min="1"
                          max={req.max}
                          placeholder={`Enter ${req.label.toLowerCase()}`}
                        />
                      )}
                      {req.type === 'file' && (
                        <input
                          type="file"
                          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          onChange={(e) => handleRequirementChange(req.id, e.target.files?.[0]?.name || '')}
                        />
                      )}
                    </div>
                  ))}
                </div>

              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  onClick={closeBookingForm}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={submitBooking}
                  disabled={!isFormValid()}
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentFacilities;