import request from "supertest";
import app from "../app"; // removed /src since tests usually sit in src/tests
import mongoose from "mongoose";
import Restaurant from "../models/Restaurant";
import Table from "../models/Table";
import Reservation from "../models/Reservation";

interface AvailableSlot {
  startTime: string;
  endTime: string;
}

describe("Availability Logic", () => {
  let restaurantId: string;

  beforeAll(async () => {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable not set");
    }
    await mongoose.connect(process.env.MONGO_URI);

    const restaurant = await Restaurant.create({
      name: "Tallie Test",
      openingTime: "10:00",
      closingTime: "22:00",
      totalTables: 2,
    });

    restaurantId = restaurant._id.toString();

    const table = await Table.create({
      restaurant: restaurantId,
      tableNumber: 1,
      capacity: 4,
    });

    await Reservation.create({
      restaurant: restaurantId,
      table: table._id,
      customerName: "John",
      phone: "123456",
      partySize: 4,
      startTime: new Date("2026-01-12T19:00:00"),
      endTime: new Date("2026-01-12T21:00:00"),
      status: "confirmed",
    });
  });

  afterAll(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  it("should NOT return overlapping time slots", async () => {
    const res = await request(app).get(
      `/api/restaurants/${restaurantId}/availability?date=2026-01-12&partySize=4&duration=120`
    );

    const times: number[] = (res.body.availableSlots as AvailableSlot[]).map(
      (s) => new Date(s.startTime).getHours()
    );

    expect(times).not.toContain(19);
    expect(times).not.toContain(20);
  });

  it("should return valid available slots", async () => {
    const res = await request(app).get(
      `/api/restaurants/${restaurantId}/availability?date=2026-01-12&partySize=4&duration=60`
    );

    const slots: AvailableSlot[] = res.body.availableSlots;
    expect(slots.length).toBeGreaterThan(0);
  });
});


// import request from "supertest";
// import app from "../src/app";
// import mongoose from "mongoose";
// import Restaurant from "../src/models/Restaurant";
// import Table from "../src/models/Table";
// import Reservation from "../src/models/Reservation";

// describe("Availability Logic", () => {
//   let restaurantId: string;

//   beforeAll(async () => {
//     await mongoose.connect(process.env.MONGO_URI!);

//     const restaurant = await Restaurant.create({
//       name: "Tallie Test",
//       openingTime: "10:00",
//       closingTime: "22:00",
//       totalTables: 2
//     });

//     restaurantId = restaurant._id.toString();

//     const table = await Table.create({
//       restaurant: restaurantId,
//       tableNumber: 1,
//       capacity: 4
//     });

//     await Reservation.create({
//       restaurant: restaurantId,
//       table: table._id,
//       customerName: "John",
//       phone: "123456",
//       partySize: 4,
//       startTime: new Date("2026-01-12T19:00:00"),
//       endTime: new Date("2026-01-12T21:00:00"),
//       status: "confirmed"
//     });
//   });

//   afterAll(async () => {
//     await mongoose.connection.db.dropDatabase();
//     await mongoose.disconnect();
//   });

//   it("should NOT return overlapping time slots", async () => {
//     const res = await request(app).get(
//       `/restaurants/${restaurantId}/availability?date=2026-01-12&partySize=4&duration=120`
//     );

//     const times = res.body.availableSlots.map(s => new Date(s.startTime).getHours());

//     expect(times).not.toContain(19);
//     expect(times).not.toContain(20);
//   });

//   it("should return valid available slots", async () => {
//     const res = await request(app).get(
//       `/restaurants/${restaurantId}/availability?date=2026-01-12&partySize=4&duration=60`
//     );

//     expect(res.body.availableSlots.length).toBeGreaterThan(0);
//   });
// });
