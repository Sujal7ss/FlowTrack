import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  email: string;
  passwordHash: string;
  name?: string;
  createdAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  name: { type: String }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
