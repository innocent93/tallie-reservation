import { Schema, model, Document, Types } from "mongoose";

/**
 * Reservation document interface
 */
export interface IReservation extends Document {
  restaurant: Types.ObjectId;
  table: Types.ObjectId;
  customerName: string;
  phone: string;
  partySize: number;
  startTime: Date;
  endTime: Date;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

/**
 * Reservation schema
 */
const ReservationSchema = new Schema<IReservation>(
  {
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },
    table: {
      type: Schema.Types.ObjectId,
      ref: "Table",
      required: true
    },
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true
    },
    partySize: {
      type: Number,
      required: true,
      min: 1
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "confirmed"
    }
  },
  {
    timestamps: true
  }
);

/**
 * Reservation model
 */
const Reservation = model<IReservation>("Reservation", ReservationSchema);

export default Reservation;

