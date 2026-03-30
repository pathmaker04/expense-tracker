// routes/history.route.ts
import express from 'express';
import { getHistory } from '../controllers/history.controllers.js';
const router = express.Router();
router.get('/', getHistory);
export default router;
//# sourceMappingURL=history.route.js.map