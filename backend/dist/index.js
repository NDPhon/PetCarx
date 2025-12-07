"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const appointmentController_1 = __importDefault(require("./controller/appointmentController"));
dotenv_1.default.config();
console.log("DATABASE_URL:", process.env.DATABASE_URL);
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express_1.default.json());
// Route cho appointment
app.use("/api/appointments", appointmentController_1.default);
const PORT = Number(process.env.BACKEND_PORT) || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//# sourceMappingURL=index.js.map