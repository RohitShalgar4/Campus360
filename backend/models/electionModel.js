// models/Election.js
import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  votes: { type: Number, default: 0 },
  position: { type: String, required: true },
});

const electionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  candidates: [candidateSchema],
  totalVoters: { type: Number, default: 0 },
  voted: { type: Number, default: 0 },
  boysVoted: { type: Number, default: 0 },
  girlsVoted: { type: Number, default: 0 },
  departmentStats: { type: Map, of: Number, default: {} },
});

const Election = mongoose.model('Election', electionSchema);

export { Election };