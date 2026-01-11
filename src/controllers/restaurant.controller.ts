import Restaurant from "../models/Restaurant";
import Table from "../models/Table";
import Reservation from "../models/Reservation";
import { generateTimeSlots } from "../utils/timeSlots.util";
import { Request, Response } from "express";


export const createRestaurant = async (req: Request, res: Response) => {
  const restaurant = await Restaurant.create(req.body);
  res.json(restaurant);
};

export const addTable = async (req: Request, res: Response) => {
  const count = await Table.countDocuments({ restaurant: req.params.id });
  const restaurant = await Restaurant.findById(req.params.id);

  if (count >= restaurant!.totalTables)
    return res.status(400).json({ message: "Max tables reached" });

  const table = await Table.create({
    restaurant: req.params.id,
    ...req.body
  });
  res.json(table);
};


export const getAvailability = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // --- Type-safe extraction of query params ---
    const dateParam = req.query.date;
    const partySizeParam = req.query.partySize;
    const durationParam = req.query.duration;

    if (!dateParam || typeof dateParam !== "string") {
      return res.status(400).json({ message: "Missing or invalid date parameter" });
    }

    const dateStr = dateParam;
    const partySize = Number(partySizeParam) || 1;
    const duration = Number(durationParam) || 120;

    if (isNaN(partySize) || isNaN(duration)) {
      return res.status(400).json({ message: "Invalid partySize or duration parameter" });
    }

    // --- Fetch tables that fit party size ---
    const tables = await Table.find({
      restaurant: restaurantId,
      capacity: { $gte: partySize },
    });

    const slots = generateTimeSlots(
      dateStr,
      restaurant.openingTime,
      restaurant.closingTime,
      duration
    );

    const availableSlots: { startTime: Date; availableTables: number }[] = [];

    for (const slot of slots) {
      const start = new Date(slot);
      const end = new Date(start.getTime() + duration * 60000); // duration is now guaranteed to be a number

      let freeTables = 0;

      for (const table of tables) {
        const conflict = await Reservation.findOne({
          table: table._id,
          status: "confirmed",
          $or: [
            { startTime: { $lt: end, $gte: start } },
            { endTime: { $gt: start, $lte: end } },
            { startTime: { $lte: start }, endTime: { $gte: end } },
          ],
        });

        if (!conflict) freeTables++;
      }

      if (freeTables > 0) {
        availableSlots.push({ startTime: start, availableTables: freeTables });
      }
    }

    res.json({ availableSlots });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch availability", details: error });
  }
};

// export const getAvailability = async (req: Request, res: Response) => {
//   const { date, partySize, duration = 120 } = req.query;

//   const restaurant = await Restaurant.findById(req.params.id);
//   if (!restaurant) {
//     return res.status(404).json({ message: "Restaurant not found" });
//   }

//   const tables = await Table.find({
//     restaurant: req.params.id,
//     capacity: { $gte: Number(partySize) }
//   });

//   const slots = generateTimeSlots(
//     date,
//     restaurant.openingTime,
//     restaurant.closingTime,
//     Number(duration)
//   );

//   const availableSlots = [];

//   for (const slot of slots) {
//     const start = new Date(slot);
//     const end = new Date(start.getTime() + duration * 60000);

//     let freeTables = 0;

//     for (const table of tables) {
//       const conflict = await Reservation.findOne({
//         table: table._id,
//         status: "confirmed",
//         $or: [
//           { startTime: { $lt: end, $gte: start } },
//           { endTime: { $gt: start, $lte: end } },
//           { startTime: { $lte: start }, endTime: { $gte: end } }
//         ]
//       });

//       if (!conflict) freeTables++;
//     }

//     if (freeTables > 0) {
//       availableSlots.push({
//         startTime: start,
//         availableTables: freeTables
//       });
//     }
//   }

//   res.json({ availableSlots });
// };

