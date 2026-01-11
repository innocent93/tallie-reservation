import express from "express";
import restaurantRoutes from "./routes/restaurant.routes";
import reservationRoutes from "./routes/reservation.routes";
import userRoutes from "./routes/user.routes";

const app = express();

// Middleware
app.use(express.json());

app.get('/', (req, res) => res.send('Hello from Tallie!'));

app.get('/health', (req, res) =>
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
);




app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'Tallie API is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/metrics', (req, res) => {
  res.status(200).json({
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
  });
});

// Routes
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/users", userRoutes);

// after all route definitions
app.use((req, res) => {
  res.status(404).json({ error: "Route Not Found" });
});

export default app;
