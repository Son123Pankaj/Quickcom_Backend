const express = require("express");
const router = express.Router();
const pool = require("./pool");
const upload = require("./multer");

router.post(
  "/productpicture_submit",  upload.any(),  function (req, res) {
    console.log(req.body);
    var f=[]
    req.files.map((item)=>{
      f.push(item.filename)
    })
  
    try {
      pool.query(
        "insert into productpictures(categoryid, subcategoryid, brandid, productid, productdetailid, filenames,created_at,updated_at,user_admin)values(?,?,?,?,?,?,?,?,?)",
        [
          req.body.categoryid,
          req.body.subcategoryid,
          req.body.brandid,
          req.body.productid,
          req.body.productdetailid,
          f+"",
          req.body.created_at,
          req.body.updated_at,
          req.body.user_admin,
        ],function (error, result) {
          if (error) {
            console.log('ffffffff',error);
            res.status(200).json({
              message: "Database Error Pls contact with backend team...!",
              status: false,
            });
          } else {
            res.status(200).json({
              message: "Product Picture Submitted Successfully",
              status: true,
            });
          }
        }
      );
    } catch (e) {
      console.log(e);
      res.status(200).json({
        message: "Severe error on server pls contact with backend team",
        status: false,
      });
    }
  }
);

module.exports = router;
