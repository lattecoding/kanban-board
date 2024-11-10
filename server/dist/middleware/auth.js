import jwt from "jsonwebtoken";
export const authenticateToken = (req, res, next) => {
    // 1. Get the token from the Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Split to get token part (Bearer <token>)
    // 2. If token is not present, send an error response
    if (!token) {
        res.status(401).json({ message: "Token missing or malformed" });
        return; // Explicit return after sending response
    }
    // 3. Verify the token using jwt.verify and your JWT_SECRET
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // 4. If token verification fails (invalid/expired), return an error response
        if (err) {
            res.status(403).json({ message: "Invalid or expired token" });
            return; // Explicit return after sending response
        }
        // 5. Attach the user data from the token to the request object
        req.user = user;
        // 6. Call next() to pass control to the next middleware/route handler
        next();
    });
};
