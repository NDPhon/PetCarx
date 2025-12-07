"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointmentService_1 = require("../service/appointmentService");
const router = (0, express_1.Router)();
router.post("/add-appointment", async (req, res) => {
    try {
        const apptData = req.body; // gán kiểu cho body
        const newAppt = await (0, appointmentService_1.insertAppointmentService)(apptData);
        res.status(201).json(newAppt);
    }
    catch (error) {
        console.error("Error inserting appointment:", error);
        // Nếu error từ DB, trả về chi tiết nếu muốn
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});
exports.default = router;
//# sourceMappingURL=appointmentController.js.map