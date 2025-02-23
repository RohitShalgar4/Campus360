const { Student, HealthRecord } = require('./healthModel');

exports.getAdminStats = async (req, res) => {
  try {
    const patientsVisited = await HealthRecord.countDocuments();
    const studentsTreated = await HealthRecord.distinct('studentId').countDocuments();
    const leaveGranted = await HealthRecord.countDocuments({ leaveGranted: true });

    res.json({
      patientsVisited,
      studentsTreated,
      leaveGranted
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching statistics' });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const activities = await HealthRecord.find()
      .populate('studentId', 'name')
      .sort({ date: -1 })
      .limit(10)
      .lean();

    const formattedActivities = activities.map(activity => ({
      id: activity._id,
      date: activity.date.toISOString().split('T')[0],
      student: activity.studentId.name,
      action: activity.leaveGranted ? 'Leave Granted' : 'Health Checkup'
    }));

    res.json(formattedActivities);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching recent activity' });
  }
};

exports.searchStudents = async (req, res) => {
  try {
    const { term } = req.query;
    const students = await Student.find({
      $or: [
        { name: { $regex: term, $options: 'i' } },
        { enrollmentNumber: { $regex: term, $options: 'i' } }
      ]
    }).limit(10);

    res.json({ students });
  } catch (error) {
    res.status(500).json({ error: 'Error searching students' });
  }
};

exports.submitHealthCheckup = async (req, res) => {
  try {
    const { studentId, symptoms, diagnosis, recommendations, leaveRequired } = req.body;
    
    const healthRecord = new HealthRecord({
      studentId,
      symptoms,
      diagnosis,
      recommendations,
      leaveRequired
    });

    await healthRecord.save();
    res.status(201).json({ message: 'Health checkup recorded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error submitting health checkup' });
  }
};