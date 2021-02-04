const Image = require('../models/image');

exports.getAddImage = (req, res, next) => {
  res.render('admin/edit-image', {
    pageTitle: 'Add Image',
    path: '/admin/add-image',
    editing: false
  });
};

exports.postAddImage = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const date = req.body.date;
  const description = req.body.description;

//Image.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
//User.hasMany(Image);
  req.user.createImage({
    title: title,
    imageUrl: imageUrl,
    date: date,  
    description: description
  }).then(result => {
    console.log('image added');
    return res.redirect('/');
  })
    .catch(err => {
    console.log(err);
  });
};

exports.getEditImage = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const imgId = req.params.imageId;
  req.user.getImages({ where: { id: imgId }})
  // Image.findByPk(imgId)
  .then(images => {
    const image = images[0];
      if (!image) {
        return res.redirect('/');
    }
    res.render('admin/edit-image', {
      pageTitle: 'Edit Image',
      path: '/admin/edit-image',
      editing: editMode,
      image: image
    });
  })
  .catch(err => {console.log(err)
  });
};

exports.postEditImage = (req, res, next) => {
  const imgId = req.body.imageId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDate = req.body.date;
  const updatedDesc = req.body.description;
  Image.findByPk(imgId)
  .then(image => {
    image.title = updatedTitle;
    image.imageUrl = updatedImageUrl;
    image.date = updatedDate;
    image.description = updatedDesc;
    return image.save();
  }).then(result => {
    console.log('image updated');
  })
  .catch( err => console.log(err));
  res.redirect('/admin/images');
};

exports.getImages = (req, res, next) => {
  // Image.findAll()
  req.user.getImages().then(images => {
    res.render('admin/images', {
      imgs: images,
      pageTitle: 'Admin Page',
      path: '/admin/images'
    });
  })
  .catch(err => console.log(err));
};

exports.postDeleteImage = (req, res, next) => {
  const imgId = req.body.imageId;
  Image.findByPk(imgId).then(image => {
    return image.destroy();
  }).then( result => {
    console.log('image deleted');
    res.redirect('/admin/images');
  }).catch(err => {
    console.log(err);
  })
};
