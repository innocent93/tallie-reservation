import { Schema, model, Document, Types } from "mongoose";

/**
 * Table document interface
 */
export interface ITable extends Document {
  restaurant: Types.ObjectId;
  tableNumber: number;
  capacity: number;
}

/**
 * Table schema
 */
const TableSchema = new Schema<ITable>(
  {
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },
    tableNumber: {
      type: Number,
      required: true
    },
    capacity: {
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
 * Table model
 */
const Table = model<ITable>("Table", TableSchema);

export default Table;


// import { Schema, model } from "mongoose";

// export default model("Table", new Schema({
//   restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant" },
//   tableNumber: Number,
//   capacity: Number
// }));
