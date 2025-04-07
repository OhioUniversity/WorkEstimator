import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import workloadRoutes from "./routes/workload";

const app = express();
const PORT = 3000;

app.use(cors({ origin: "http://localhost:4200" })); // Allow requests from Angular frontend
app.use(bodyParser.json());

app.use("/api/workload", workloadRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
