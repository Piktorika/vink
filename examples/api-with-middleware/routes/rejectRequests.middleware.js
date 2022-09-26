export default (req, res, next) => {
  res.status(403).send({ message: "Forbidden" });
};
