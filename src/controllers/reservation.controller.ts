import Table from "../models/Table";
import Reservation from "../models/Reservation";
import Waitlist from "../models/Waitlist";
import Restaurant from "../models/Restaurant";
import { sendSMS } from "../services/notification.service";
import { Request, Response, NextFunction } from "express";


export const createReservation = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const {
      restaurantId,
      partySize,
      startTime,
      duration,
      customerName,
      phone
    } = req.body;

    if (!partySize || !startTime || !duration) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);

    // ⏰ Operating hours validation
    const [openH, openM] = restaurant.openingTime.split(":").map(Number);
    const [closeH, closeM] = restaurant.closingTime.split(":").map(Number);

    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();

    if (startMinutes < openMinutes || endMinutes > closeMinutes) {
      return res.status(400).json({ message: "Outside operating hours" });
    }

    // 🎯 Seating optimization (smallest fitting table)
    const tables = await Table.find({
      restaurant: restaurantId,
      capacity: { $gte: partySize }
    }).sort({ capacity: 1 });

    for (const table of tables) {
      const overlap = await Reservation.findOne({
        table: table._id,
        status: "confirmed",
        $or: [
          { startTime: { $lt: end, $gte: start } },
          { endTime: { $gt: start, $lte: end } },
          { startTime: { $lte: start }, endTime: { $gte: end } }
        ]
      });

      if (!overlap) {
        const reservation = await Reservation.create({
          restaurant: restaurantId,
          table: table._id,
          customerName,
          phone,
          partySize,
          startTime: start,
          endTime: end,
          status: "confirmed"
        });

        // 📩 Mock SMS
        sendSMS(phone, `Reservation confirmed at ${restaurant.name} for ${start.toLocaleTimeString()}`);

        return res.status(201).json(reservation);
      }
    }

    // 🧾 Waitlist
    await Waitlist.create(req.body);
    return res.status(202).json({ message: "No tables available. Added to waitlist." });

  } catch (err) {
    next(err);
  }
};

