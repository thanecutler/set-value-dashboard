const app = express();
// psa

app.post("/api/psa/add", (req, res) => {
  const { card_name, set_name, card_number, card_grade } = req.body;
  const sql =
    "INSERT INTO psa_cards (card_name, set_name, card_number, card_grade) VALUES (?, ?, ?, ?);";
  const vals = [card_name, set_name, card_number, card_grade];
  db.query(sql, vals, (e, results) => {
    if (e) {
      throw e;
    }
  });
  db.query("SELECT * FROM psa_cards", (e, results) => {
    if (e) {
      throw e;
    }
    res.send(results);
  });
});

app.get("/api/psa/all", (req, res) => {
  db.query("SELECT * FROM psa_cards", (e, results) => {
    if (e) {
      throw e;
    }
    res.send(results);
  });
});

app.delete("/api/psa/remove", (req, res) => {
  const { id } = req.body;
  const sql = "DELETE FROM psa_cards WHERE id = ?";
  db.query(sql, [id], (e, results) => {
    if (e) {
      throw e;
    }
    res.send(results);
  });
});
