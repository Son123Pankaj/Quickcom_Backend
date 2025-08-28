var express = require("express");
var router = express.Router();
var upload = require("./multer");
var pool = require("./pool");

router.post(
  "/product_submit",
  upload.single("productpicture"),
  function (req, res) {
    try {
      pool.query(
        "insert into product(categoryid, subcategoryid, brandid, productname, productdescription, picture, created_at, updated_at, user_admin)value(?,?,?,?,?,?,?,?,?)",
        [
          req.body.categoryid,
          req.body.subcategoryid,
          req.body.brandid,
          req.body.productname,
          req.body.productdescription,
          req.file.filename,
          req.body.created_at,
          req.body.updated_at,
          req.body.user_admin,
        ],
        function (error, result) {
          if (error) {
            res.status(200).json({
              message: "Database Error Pls contact with backend team...!",
              status: false,
            });
          } else {
            res
              .status(200)
              .json({
                message: "Product Submitted Successfully",
                status: true,
              });
          }
        }
      );
    } catch (e) {
      res.status(200).json({
        message: "Severe error on server pls contact with backend team",
        status: false,
      });
    }
  }
);
router.post("/edit_product_data", function (req, res) {
  try {
    pool.query(
      "update product set categoryid=?,subcategoryid=?,brandid=?,productname=?,productdescription=?,updated_at=?,user_admin=? where productid=?",
      [
        req.body.categoryid,
        req.body.subcategoryid,
        req.body.brandid,
        req.body.productname,
        req.body.productdescription,
        req.body.updated_at,
        req.body.user_admin,
        req.body.productid,
      ],
      function (error, result) {
        if (error) {
          res.status(200).json({
            message: "Database Error Pls contact with backend team...!",
            status: false,
          });
        } else {
          res
            .status(200)
            .json({ message: "Product Updated Succesfully", status: true });
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
});

router.post(
  "/edit_product_picture",
  upload.single("productpicture"),
  function (req, res) {
    try {
      pool.query(
        "update product set picture=?,updated_at=?,user_admin=? where productid=?",
        [
          req.file.filename,
          req.body.updated_at,
          req.body.user_admin,
          req.body.productid,
        ],
        function (error, result) {
          if (error) {
            res.status(200).json({
              message: "Database Error Pls contact with backend team...!",
              status: false,
            });
          } else {
            res
              .status(200)
              .json({
                message: "Product Picture Updated Successfully",
                status: true,
              });
          }
        }
      );
    } catch (e) {
      res.status(200).json({
        message: "Severe error on server pls contact with backend team",
        status: false,
      });
    }
  }
);

router.post("/delete_product", function (req, res) {
  try {
    pool.query(
      "delete from product where productid=?",
      [req.body.productid],
      function (error, result) {
        if (error) {
          res.status(200).json({
            message: "Database Error Pls contact with backend team...!",
            status: false,
          });
        } else {
          res
            .status(200)
            .json({ message: "Product deleted Successfully", status: true });
        }
      }
    );
  } catch (e) {
    res.status(200).json({
      message: "Severe error on server pls contact with backend team",
      status: false,
    });
  }
});

router.get("/display_all_product", function (req, res) {
  try {
    pool.query(
      "select P.*,(select C.categoryname from category C where C.categoryid=P.categoryid) as categoryname,(select SC.subcategoryname from subcategory SC where SC.subcategoryid=P.subcategoryid) as subcategoryname,(select B.brandname from brand B where B.brandid=P.brandid) as brandname  from product P",
      function (error, result) {
        if (error) {
          res.status(200).json({
            message: "Database Error Pls contact with backend team...!",
            status: false,
          });
        } else {
          res
            .status(200)
            .json({ message: "Succesfully", data: result, status: true });
        }
      }
    );
  } catch (e) {
    res.status(200).json({
      message: "Severe error on server pls contact with backend team",
      status: false,
    });
  }
});


router.post("/get_all_product_by_brandid", function (req, res) {
  try {
    pool.query(
      "select P.*,(select C.categoryname from category C where C.categoryid=P.categoryid) as categoryname,(select SC.subcategoryname from subcategory SC where SC.subcategoryid=P.subcategoryid) as subcategoryname,(select B.brandname from brand B where B.brandid=P.brandid) as brandname  from product P where P.brandid=?",[req.body.brandid],
      function (error, result) {
        if (error) {
          res.status(200).json({
            message: "Database Error Pls contact with backend team...!",
            status: false,
          });
        } else {
          res
            .status(200)
            .json({ message: "Succesfully", data: result, status: true });
        }
      }
    );
  } catch (e) {
    res.status(200).json({
      message: "Severe error on server pls contact with backend team",
      status: false,
    });
  }
});




module.exports = router;
