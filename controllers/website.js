const Image = require('../models/image');
const { search } = require('../routes/website');

exports.getImages = (req, res, next) => {
  Image.findAll()
  .then(images => {
    res.render('website/image-list', {
      imgs: images,
      pageTitle: 'All Images',
      path: '/images'
    });
  })
  .catch(err => {
    console.log(err);
  });
};

// get image page
exports.getImage = (req, res, next) => {
  const imgId = req.params.imageId;
  Image.findByPk(imgId)
  .then(image => {
    res.render('website/image-detail', {
      image: image,
      pageTitle: image.title,
      path: '/images'
    });
  })
  .catch(err => {
    console.log(err)
  });
};

//render our page once we got the images
exports.getIndex = (req, res, next) => {
  Image.findAll()
    .then(images => {
      res.render('website/index', {
        imgs: images,
        pageTitle: 'Welcome',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getSearch = (req, res, next) => {
  res.render('website/search', {
    path: '/search',
    pageTitle: 'Search Image'
  });
};

exports.getFave = (req, res, next) => {
  req.user.getFave()
  .then(fave => {
    return fave.getImages()
    .then(images => {
    res.render('website/fave', {
      path: '/fave',
      pageTitle: 'Your Fave',
      images: images
    });
  })
  .catch(err => console.log(err));
})
.catch(err => console.log(err));
};

exports.postFave = (req, res, next) => {
  let checkQuantity = 1;
  const imgId = req.body.imageId;
  let sendTofave;
  req.user.getFave()
  .then(fave => {
    sendTofave = fave;
    return fave.getImages( { where: { id: imgId }});
  })
  .then(images => {
    let image;
    if(images.length > 0) {
      image = images[0];
    }
    if(image) {
      const existingQuantity = image.faveImage.quantity;
      checkQuantity = existingQuantity + 1;
      return image;
    }
    return Image.findByPk(imgId);
  })
  .then(image => {
    return sendTofave.addImage(image, { through: { quantity: checkQuantity}});
  })
  .then(() => {
    res.redirect('/images')
  })
  .catch(err => console.log(err));
};

exports.postFaveDeleteImage = (req, res, next) => {
  const imgId = req.body.imageId;
  req.user
  .getFave()
  .then(fave => {
    return fave.getImages( { where: { id: imgId }});
  })
  .then(images => {
    const image = images[0];
    return image.faveImage.destroy();
  })
  .then( result => {
    res.redirect('/fave')
  })
  .catch(err => console.log(err));
};

// exports.postSearchImage = (req, res, next) => {
//   var searchTerm = req.query.search;

//   var image = req.query.image;

//     let query = 'SELECT * FROM art-website';
//     if (searchTerm != ''&& image != '') {
//       query = `SELECT * FROM art-website WHERE Image = '` + image + `'AND ( title LIKE '%` + searchTerm + `%' OR description LIKE '%` + searchTerm + `%')`;
//     }
//     else if (searchTerm != '' && image == '') {
//       query = `SELECT * FROM art-website WHERE title LIKE  '%` + searchTerm + `%' OR Comment LIKE '%` + searchTerm + `%')`;
//     }
//     else if (searchTerm == '' && image != ''){
//       query = `SELECT * FROM art-website WHERE Image = '` + image + `'`;
//     }
//   }