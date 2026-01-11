

import { Schema, model, Document } from "mongoose";

/**
 * Restaurant document interface
 */
export interface IRestaurant extends Document {
  name: string;
  openingTime: string;
  closingTime: string;
  totalTables: number;
}

/**
 * Restaurant schema
 */
const RestaurantSchema = new Schema<IRestaurant>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    openingTime: {
      type: String,
      required: true
    },
    closingTime: {
      type: String,
      required: true
    },
    totalTables: {
      type: Number,
      required: true,
      min: 1
    }
  },
  {
    timestamps: true
  }
);

/**
 * Restaurant model
 */
const Restaurant = model<IRestaurant>("Restaurant", RestaurantSchema);

export default Restaurant;
