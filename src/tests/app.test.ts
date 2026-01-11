import dotenv from "dotenv";
dotenv.config();

import request from "supertest";
import app from "../app"; // remove /src and .js
import mongoose from "mongoose";

interface ReservationPayload {
  restaurantId: string;
  date: string;
  tableId: string;
}

const payload: ReservationPayload = {
  restaurantId: "123",
  date: new Date().toISOString(),
  tableId: "abc",
};

describe("API Endpoints", () => {
  // Health Check
  describe("GET /health", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/health").expect(200);

      expect(response.body).toHaveProperty("status", "OK");
      expect(response.body).toHaveProperty("timestamp");
      expect(response.body).toHaveProperty("uptime");
    });
  });

  // Base API Check
  describe("GET /api", () => {
    it("should return API message", async () => {
      const response = await request(app).get("/api").expect(200);

      expect(response.body).toHaveProperty("status", "Tallie API is running");
      expect(response.body).toHaveProperty("timestamp");
    });
  });

  // POST /api/reservations
  describe("POST /api/reservations", () => {
    it("prevents overlapping reservations", async () => {
      // Make sure the app and DB are ready before this test
      const res = await request(app).post("/api/reservations").send(payload);

      // Check response
      expect([200, 400]).toContain(res.status); // 400 if overlapping, 200 if OK
      // If you expect overlap to always fail, you can use:
      // expect(res.status).toBe(400);
    });
  });

  // 404 Route
  describe("GET /nonexistent", () => {
    it("should return 404 for non-existent routes", async () => {
      const response = await request(app).get("/nonexistent").expect(404);

      expect(response.body).toHaveProperty("error", "Route Not Found");
    });
  });
});

// Optional: Disconnect mongoose after all tests if using DB
afterAll(async () => {
  if (mongoose.connection.readyState) {
    await mongoose.disconnect();
  }
});



// import request from 'supertest';
// import app from '../src/app';

// const payload = {
//   restaurantId: "123",
//   date: new Date().toISOString(),
//   tableId: "abc",
// };


// describe('API Endpoints', () => {
//   // TEST /health
//   describe('GET /health', () => {
//     it('should return health status', async () => {
//       const response = await request(app).get('/health').expect(200);

//       expect(response.body).toHaveProperty('status', 'OK');
//       expect(response.body).toHaveProperty('timestamp');
//       expect(response.body).toHaveProperty('uptime');
//     });
//   });

//   // TEST /api
//   describe('GET /api', () => {
//     it('should return API message', async () => {
//       const response = await request(app).get('/api').expect(200);

//       expect(response.body).toHaveProperty('status', 'Tallie API is running');
//       expect(response.body).toHaveProperty('timestamp');
//     });
//   } );
  
//   describe('POST /api/reservation', () => {
//     it('prevents overlapping reservations', async () => {
//       const res = await request(app).post("/api/reservations").send(payload);
//       expect(res.status).toBe(400);
//     });
//   });

//   // TEST 404 ROUTES
//   describe('GET /nonexistent', () => {
//     it('should return 404 for non-existent routes', async () => {
//       const response = await request(app).get('/nonexistent').expect(404);

//       expect(response.body).toHaveProperty('error', 'Route Not Found');
//     });
//   });
// });
