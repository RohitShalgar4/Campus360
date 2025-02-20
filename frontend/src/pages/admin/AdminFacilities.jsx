import React, { useState, useMemo } from 'react';
import { Calendar, Clock, MapPin, Users, Search, Filter, Plus, AlertCircle, Edit, Trash } from 'lucide-react';

const INITIAL_FACILITIES = [
  {
    id: 1,
    name: 'Main Auditorium',
    capacity: 500,
    location: 'Main Building, Ground Floor',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1000',
    status: 'active'
  },
  {
    id: 2,
    name: 'Conference Room A',
    capacity: 50,
    location: 'Library Building, 2nd Floor',
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=1000',
    status: 'active'
  },
  {
    id: 3,
    name: 'Sports Complex',
    capacity: 200,
    location: 'Sports Block',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000',
    status: 'active'
  }
];

const INITIAL_BOOKINGS = [
  {
    id: 1,
    facility: 'Main Auditorium',
    date: '2024-03-20',
    slot: '09:00 AM - 12:00 PM',
    purpose: 'Annual Cultural Fest',
    requestedBy: 'John Doe',
    status: 'pending',
    requirements: {
      schedule: 'event_schedule.pdf',
      technical: 'Need a projector and sound system',
      deposit: '5000',
      attendees: '300'
    }
  },
  {
    id: 2,
    facility: 'Conference Room A',
    date: '2024-03-21',
    slot: '02:00 PM - 03:00 PM',
    purpose: 'Department Meeting',
    requestedBy: 'Jane Smith',
    status: 'pending',
    requirements: {
      agenda: 'Meeting agenda document',
      duration: '2',
      department: 'Computer Science',
      approval: 'approval_letter.pdf'
    }
  }
];

function AdminFacilities() {
  const [facilities, setFacilities] = useState(INITIAL_FACILITIES);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddFacility, setShowAddFacility] = useState(false);
  const [newFacility, setNewFacility] = useState({
    name: '',
    capacity: '',
    location: '',
    image: ''
  });
  const [editingFacility, setEditingFacility] = useState(null);

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesSearch = booking.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

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

  const handleAddFacility = () => {
    if (!newFacility.name || !newFacility.capacity || !newFacility.location || !newFacility.image) {
      alert('Please fill in all fields');
      return;
    }

    const facility = {
      id: Date.now(),
      ...newFacility,
      status: 'active'
    };

    setFacilities([...facilities, facility]);
    setNewFacility({ name: '', capacity: '', location: '', image: '' });
    setShowAddFacility(false);
  };

  const handleEditFacility = (facility) => {
    setEditingFacility(facility);
    setNewFacility({
      name: facility.name,
      capacity: facility.capacity,
      location: facility.location,
      image: facility.image
    });
    setShowAddFacility(true);
  };

  const handleUpdateFacility = () => {
    setFacilities(facilities.map(facility =>
      facility.id === editingFacility.id
        ? { ...facility, ...newFacility }
        : facility
    ));
    setNewFacility({ name: '', capacity: '', location: '', image: '' });
    setEditingFacility(null);
    setShowAddFacility(false);
  };

  const handleDeleteFacility = (id) => {
    if (window.confirm('Are you sure you want to delete this facility?')) {
      setFacilities(facilities.filter(facility => facility.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search bookings..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 h-5 w-5" />
            <select
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Facilities Management */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Manage Facilities</h2>
          <button
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            onClick={() => setShowAddFacility(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Facility
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => (
            <div key={facility.id} className="border rounded-lg overflow-hidden">
              <img
                src={facility.image}
                alt={facility.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">{facility.name}</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>Capacity: {facility.capacity}</p>
                  <p>Location: {facility.location}</p>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                    onClick={() => handleEditFacility(facility)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    onClick={() => handleDeleteFacility(facility.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Requests */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">Booking Requests</h2>
        {filteredBookings.length === 0 ? (
          <div className="text-gray-500 text-center py-4">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>No booking requests found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{booking.facility}</h3>
                    <p className="text-sm text-gray-600">
                      Requested by: {booking.requestedBy}
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{booking.slot}</span>
                      </div>
                      <p>Purpose: {booking.purpose}</p>
                    </div>

                    {/* Display Facility Requirements Filled by Student */}
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900">Facility Requirements</h4>
                      <div className="space-y-2 mt-2">
                        {booking.requirements ? (
                          Object.entries(booking.requirements).map(([key, value]) => (
                            <div key={key} className="text-sm text-gray-600">
                              <span className="font-medium">{key}: </span>
                              <span>{value}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No requirements provided.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Approve/Reject Buttons or Status */}
                  <div className="flex items-center space-x-2">
                    {booking.status === 'pending' ? (
                      <>
                        <button
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                          onClick={() => handleApproveBooking(booking.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          onClick={() => handleRejectBooking(booking.id)}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        booking.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Facility Modal */}
      {showAddFacility && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              {editingFacility ? 'Edit Facility' : 'Add New Facility'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facility Name
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newFacility.name}
                  onChange={(e) => setNewFacility({ ...newFacility, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newFacility.capacity}
                  onChange={(e) => setNewFacility({ ...newFacility, capacity: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newFacility.location}
                  onChange={(e) => setNewFacility({ ...newFacility, location: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newFacility.image}
                  onChange={(e) => setNewFacility({ ...newFacility, image: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  onClick={() => {
                    setShowAddFacility(false);
                    setEditingFacility(null);
                    setNewFacility({ name: '', capacity: '', location: '', image: '' });
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  onClick={editingFacility ? handleUpdateFacility : handleAddFacility}
                >
                  {editingFacility ? 'Update' : 'Add'} Facility
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminFacilities;