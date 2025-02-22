import aj from "../config/arcJet.js";

const arcjetMiddleware = async (req, res, next) => {
  try {
    const decesion = await aj.protect(req, { requested: 1 });

    if (decesion.isDenied()) {
      if (decesion.reason.isRateLimit()) {
        return res.status(429).json({ message: "rate limit exceeded" });
      }
      if (decesion.reason.isBot()) {
        return res.status(403).json({ message: "Bot detected" });
      }
      return res.status(403).json({ error: "access denied" });
    }

    next();
  } catch (error) {
    console.log(`arcjet error ${error}`);
    next(error);
  }
};
export default arcjetMiddleware;
