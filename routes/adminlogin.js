express = require('express');
var router = express.Router();
var upload = require('./multer')
var pool = require('./pool')
/* GET home page. */
router.post('/chk_admin_login', function(req, res, next) {
              try{
                    pool.query("select * from admins where (emailid=? or mobileno=?) and password=?",[req.body.emailid,req.body.emailid,req.body.password],function(error,result){
                           if(error)
                            {console.log(error)
                              res.status(200).json({message:'Database error please contact with backendteam...'+error,status:false})
                            }
                            else
                            { if(result.length==1)
                            {   console.log("Valid")
                                res.status(200).json({message:'Success',status:true})

                            }
                            else
                            {   console.log("Invalid")
                              res.status(200).json({message:'Invalid Emailid/Mobile Number/Password',status:false})
                            }
                            }
                    })
               }
               catch(e)
               {
                     res.status(200).json({message:'Severe error on server please contact with backendteam..',status:false})
               }
      });




    module.exports = router;
