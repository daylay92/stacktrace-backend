import mongoose from 'mongoose';

const { Schema } = mongoose;
const options = { timestamps: true };

const answerSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    question: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Question'
    },
    text: {
      type: String,
      required: true,
      minlength: 6
    }
  },
  options
);
const Answer = mongoose.model('Answer', answerSchema);

export default Answer;
