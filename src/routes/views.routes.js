import { Router } from "express";
const router = Router();

router.get("/realtimecarts", async (req, res) => {
    res.render("realtimecarts")
})

router.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts")
})


router.get("/", async (req, res) => {
    res.render("home")
})

export default router
