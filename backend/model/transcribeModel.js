import mongoose from 'mongoose';

const transcribeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  title: { type: String, required: true },   
  content: { type: String, required: true },                          
  createdAt: { type: Date, default: Date.now }
});

const transcribeModel = mongoose.models.Transcribe || mongoose.model('Transcribe', transcribeSchema);

export default transcribeModel;
