import mongoose, { Schema } from 'mongoose';
import BaseSchema from './BaseSchema';

const schema = BaseSchema.extend({
  courseNo: { type: Number },
  lessonNo: { type: Number },
  audio: { type: String },
  audios: [String],
  nickname: { type: String },
  serverIds: [String],
  type: {type: String},
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'account',
  },
  learningHistory: {
    type: Schema.Types.ObjectId,
    ref: 'LearningHistory',
  },
});

export default mongoose.model('Homework', schema);
