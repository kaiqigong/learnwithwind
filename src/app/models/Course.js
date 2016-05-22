import mongoose from 'mongoose';
import BaseSchema from './BaseSchema';

const schema = BaseSchema.extend({
  englishTitle: { type: String},
  chineseTitle: { type: String},
  courseNo: { type: Number},
  imageUrl: { type: String},
  lessonCount:{type: Number},
  description: { type: String},
});

export default mongoose.model('Course', schema);
