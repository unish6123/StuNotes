import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: "Not authorized login again." })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        if (!decodedToken.id) {
            return res.json({ success: false, message: "Not authorized login again." })
        } else {
            req.body.userId = decodedToken.id
        }
        next();

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export default userAuth;
