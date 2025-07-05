import mongoose from 'mongoose';
//schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://h-o-m-e.org/wp-content/uploads/2022/04/Blank-Profile-Picture-1.jpg",
    },
}, {
  timestamps: true});

  //model
const User = mongoose.model('User', userSchema);
// user - name of model
export default User;
