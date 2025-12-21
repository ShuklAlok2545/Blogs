import mongoose from 'mongoose';

const urlTrackerSchema = new mongoose.Schema({
  lastUrl: String
});

export const urlTracker = mongoose.model('urlTracker', urlTrackerSchema);
