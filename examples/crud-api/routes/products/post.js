export default (req, res) => {
  const end = () =>
    req.db.all("SELECT * FROM Product", (err, products) =>
      res.status(200).send(products)
    );

  req.body.forEach((product, index) => {
    const { id, name, price } = product;

    req.db.run("INSERT INTO Product VALUES(?,?,?)", id, name, price);

    if (index === req.body.length - 1) end();
  });
};
