import { Schema, model } from "mongoose";

export default model("Waitlist", new Schema({
  restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant" },
  customerName: String,
  phone: String,
  partySize: Number,
  startTime: Date,
  duration: Number,
  status: { type: String, default: "waiting" }
}));
