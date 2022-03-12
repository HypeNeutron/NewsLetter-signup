const express = require("express");
const bodyParser = require("body-parser");
const client = require("@mailchimp/mailchimp_marketing");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// mailchimp client config-------------
client.setConfig({
  apiKey: process.env.MAIL_CHIMP_API_KEY,
  server: "us7",
});

// listen server-----------------------------------
app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on port 3000");
});

// get request form client sent html file----------
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// App method post---------------------------------
app.post("/", async function (req, res) {
  const { firstName, lastName, email } = await req.body;
  (async function () {
    try {
      await client.lists.batchListMembers(process.env.LIST_ID, {
        members: [
          {
            email_address: email,
            status: "subscribed",
            merge_fields: {
              FNAME: firstName,
              LNAME: lastName,
            },
          },
        ],
      });
      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      res.sendFile(__dirname + "/failure.html");
    }
  })();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});
