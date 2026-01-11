import app from "./app";
import { connectDB } from "./config/db";

// Connect to DB
connectDB();

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
