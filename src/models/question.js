import mongoose from 'mongoose';

const { Schema } = mongoose;
const options = { timestamps: true };

const questionSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    text: {
      type: String,
      required: true,
      minlength: 6
    },
    upVote: {
      total: {
        type: Number,
        default: 0
      },
      by: [
        {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'User'
        }
      ]
    },
    downVote: {
      total: {
        type: Number,
        default: 0
      },
      by: [
        {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'User'
        }
      ]
    },
    answers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Answer'
      }
    ]
  },
  options
);
questionSchema.index({ text: 'text' });
const Question = mongoose.model('Question', questionSchema);

export default Question;
