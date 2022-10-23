export default (req, res) =>
  req.db.all("SELECT * FROM Product", (err, result) =>
    res.status(200).send(result)
  );
