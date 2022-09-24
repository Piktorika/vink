export default (req, res, next) => {
  res.status(400).send({ message: "This route throws an error" });
};
