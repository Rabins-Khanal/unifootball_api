import mongoose from 'mongoose';

const fixtureSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    team_1: {
      type: String,
      required: true,
    },
    team_2: {
      type: String,
      required: true,
      unique: true,
    },
    team_1_logo: {
      type: String,
      default:
        'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
    },
    team_2_logo: {
        type: String,
        default:
          'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
      },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Fixture = mongoose.model('Fixture', fixtureSchema);

export default Fixture;
