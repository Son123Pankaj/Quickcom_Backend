var express = require("express");
var router = express.Router();
var upload = require("./multer");
var pool = require("./pool");

router.post(
  "/productdetail_submit",
  upload.single("picture"),
  function (req, res) {

    // console.log(req.body.stock)
    try {
      pool.query(
        "insert into productdetail (categoryid, subcategoryid, brandid, productid, productdetailname, weight, weighttype, packagingtype, noofqty, stock, price, offerprice, offertype, productstatus, productdetaildescription, picture, created_at, updated_at, user_admin)value(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          req.body.categoryid,
          req.body.subcategoryid,
          req.body.brandid,
          req.body.productid,
          req.body.productdetailname,
          req.body.weight,
          req.body.weighttype,
          req.body.packagingtype,
          req.body.noofqty,
          req.body.stock,
          req.body.price,
          req.body.offerprice,
          req.body.offertype,
          req.body.productstatus,
          req.body.productdetaildescription,
          req.file.filename,
          req.body.created_at,
          req.body.updated_at,
          req.body.user_admin,
        ],
        function (error, result) {
          if (error) {
            console.log("mmm", error)
            res.status(200).json({
              message: "Database Error Pls contact with backend team...!",
              status: false,
            });
          } else {
            console.log("mmv", result)
            res.status(200).json({
              message: "Product Detail Submitted Successfully",
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
router.post("/edit_productdetail_data", function (req, res) {


  try {
    pool.query(
      "update productdetail set categoryid=?, subcategoryid=?, brandid=?, productid=?, productdetailname=?, weight=?, weighttype=?, packagingtype=?, noofqty=?, stock=?, price=?, offerprice=?, offertype=?, productstatus=?, productdetaildescription=?,updated_at=?, user_admin=? where productdetailid=?",
      [
        req.body.categoryid,
        req.body.subcategoryid,
        req.body.brandid,
        req.body.productid,
        req.body.productdetailname,
        req.body.weight,
        req.body.weighttype,
        req.body.packagingtype,
        req.body.noofqty,
        req.body.stock,
        req.body.price,
        req.body.offerprice,
        req.body.offertype,
        req.body.productstatus,
        req.body.productdetaildescription,
        req.body.updated_at,
        req.body.user_admin,
        req.body.productdetailid,
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
            .json({ message: "Product Detail Updated Succesfully", status: true });
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
  "/edit_productdetail_picture",
  upload.single("picture"),
  function (req, res) {
    try {
      pool.query(
        "update productdetail set picture=?,updated_at=?,user_admin=? where productdetailid=?",
        [
          req.file.filename,
          req.body.updated_at,
          req.body.user_admin,
          req.body.productdetailid,
        ],
        function (error, result) {
          if (error) {
            res.status(200).json({
              message: "Database Error Pls contact with backend team...!",
              status: false,
            });
          } else {
            res.status(200).json({
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

router.post("/delete_productdetail", function (req, res) {
  try {
    pool.query(
      "delete from productdetail where productid=?",
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
            .json({ message: "Product Detail deleted Successfully", status: true });
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

router.get("/display_all_productdetail", function (req, res) {


  try {
    console.log("Body", req.body);

    pool.query(
      "select P.*,(select C.categoryname from category C where C.categoryid=P.categoryid) as categoryname,(select SC.subcategoryname from subcategory SC where SC.subcategoryid=P.subcategoryid) as subcategoryname,(select B.brandname from brand B where B.brandid=P.brandid) as brandname,(select Pr.productname from product Pr where Pr.productid=P.productid) as productname  from productdetail P",
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
router.post("/get_all_productdetail_by_productid", function (req, res) {
    

  try {    console.log("Body", req.body);

    pool.query(
      "select P.*,(select C.categoryname from category C where C.categoryid=P.categoryid) as categoryname,(select SC.subcategoryname from subcategory SC where SC.subcategoryid=P.subcategoryid) as subcategoryname,(select B.brandname from brand B where B.brandid=P.brandid) as brandname,(select Pr.productname from product Pr where Pr.productid=P.productid) as productname  from productdetail P where P.productid=?",[req.body.productid],
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
