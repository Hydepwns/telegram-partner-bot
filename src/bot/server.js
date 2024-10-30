const express = require("express");
const bodyParser = require("body-parser");
const { createGroup } = require("./groupManagement");
const { postWithFallback } = require("./utils");

const app = express();
app.use(bodyParser.json());

app.get("/endpoint", async (req, res) => {
  console.log("Received a request.");
  const { NAME: name, RECORD: record, PREFIX: prefix = "", TYPE: type } = req.query;
  const groupName = `${prefix} & ${name} (${type})`;

  try {
    const link = await createGroup(groupName);
    console.log(link);

    if (record) {
      const responseData = await postWithFallback("https://hook.eu1.make.com/", { name, link, type, record });
      console.log('Data sent successfully:', responseData);
    }

    res.status(200).json({ link });
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

const listener = app.listen(20000, () => {
  console.log("Listening on port " + listener.address().port);
});
