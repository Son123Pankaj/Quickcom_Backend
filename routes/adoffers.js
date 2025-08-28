express = require('express');
var router = express.Router();
var upload = require('./multer')
var pool = require('./pool')
/* GET home page. */
router.post('/adoffers_submit',upload.any(), function(req, res, next) {
      console.log(req.files)
      var f=[]
      req.files.map((item)=>{
        f.push(item.filename)
      })
               try{
                    pool.query("insert into adoffers( categoryid, subcategoryid, brandid, productid, productdetailid, filenames, created_at,updated_at, user_admin) values(?,?,?,?,?,?,?,?,?)",[req.body.categoryid, req.body.subcategoryid, req.body.brandid, req.body.productid, req.body.productdetailid, f+"", req.body.created_at, req.body.updated_at, req.body.user_admin],function(error,result){
                           if(error)
                            {console.log("rr",error)
                              res.status(200).json({message:'Database error please contact with backendteam...'+error,status:false})
                            }
                            else
                            {
                              res.status(200).json({message:'Adoffers submitted successfully..',status:true})
                            }
                    })
               }
               catch(e)
               {
                     res.status(200).json({message:'Severe error on server please contact with backendteam..',status:false})
               }
      });




    module.exports = router;