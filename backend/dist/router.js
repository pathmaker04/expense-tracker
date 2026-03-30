import { Router } from "express";
const router = Router();
router.get('/', (req, res) => {
    res.send('<h1>Welcome to the Expense Tracker API</h1><a href="/">Go back</a>');
});
export { router };
//# sourceMappingURL=router.js.map