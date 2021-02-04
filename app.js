const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./webdb/database");
const Image = require("./models/image");
const User = require("./models/user");
const Fave = require("./models/fave");
const FaveImage = require("./models/fave-image");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);

const websiteRoutes = require("./routes/website");
app.use(websiteRoutes);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//get image + get fave
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use(errorController.get404);

Image.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Image);
// one-to-many relationship, to the user id to which the fave belings
User.hasOne(Fave);
Fave.belongsTo(User);

//many-to-many relationship and where these connection should be stored (in Faveimage model).
Fave.belongsToMany(Image, { through: FaveImage });
Image.belongsToMany(Fave, { through: FaveImage });

//look at all the models we defined
sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      //testing user
      return User.create({ name: "ronan", email: "gg@yahoo.com" });
    }
    return user;
  })
  .then((user) => {
    return user.createFave();
  })
  .then((fave) => {
    app.listen(8000);
  })
  .catch((err) => {
    console.log(err);
  });
