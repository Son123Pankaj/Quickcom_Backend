var express = require('express');
var router = express.Router();
var upload = require('./multer')
var pool = require('./pool')
/* GET home page. */



router.post('/subcategory_submit', upload.single('subcategoryicon'), function (req, res, next) {
    try {
        pool.query(
            "INSERT INTO subcategory(categoryid, subcategoryname, subcategoryicon, created_at, updated_at, user_admin) VALUES (?, ?, ?, ?, ?, ?)",
            [
                req.body.categoryid,
                req.body.subcategoryname,
                req.file.filename,
                req.body.created_at,
                req.body.updated_at,
                req.body.user_admin
            ],
            function (error, result) {
                if (error) {
                    res.status(200).json({ message: 'Database Error, please contact the backend team...', status: false });
                } else {
                    res.status(200).json({ message: 'Subcategory submitted successfully', status: true });
                }
            }
        );
    } catch (e) {
        res.status(200).json({ message: 'Severe error on server, please contact the backend team', status: false });
    }
});



router.post('/edit_subcategory_data', function (req, res, next) {
    try {
        pool.query("update subcategory set subcategoryname=?,categoryid=?,updated_at=?,user_admin=? where subcategoryid=?",
            [
                req.body.subcategoryname,
                req.body.categoryid,
                req.body.updated_at,
                req.body.user_admin,
                req.body.subcategoryid
            ], function (error, result) {
                if (error) {
                    console.log(error)
                    res.status(500).json({ message: 'Database Error Pls contact with backend team...', status: false })
                }
                else {
                    res.status(200).json({ message: 'Category updated successfully', status: true })
                }

            })

    }
    catch (e) {
        res.status(200).json({ message: 'Severe error on server pls contact with backend team', status: false })
    }
});



router.post('/edit_subcategory_icon', upload.single('subcategoryicon'), function (req, res, next) {
    try {
        pool.query("update subcategory set subcategoryicon=?,updated_at=?,user_admin=? where subcategoryid=?", [req.file.filename, req.body.updated_at, req.body.user_admin, req.body.subcategoryid], function (error, result) {
            if (error) {
                res.status(200).json({ message: 'Database Error Pls contact with backend team...', status: false })
            }
            else {
                res.status(200).json({ message: 'Category updated successfully', status: true })
            }

        })

    }
    catch (e) {

        res.status(200).json({ message: 'Severe error on server pls contact with backend team', status: false })
    }
});

router.post('/delete_subcategory', function (req, res, next) {
    try {
        pool.query("delete  from subcategory  where subcategoryid=?", [req.body.subcategoryid], function (error, result) {
            if (error) {
                res.status(200).json({ message: 'Database Error Pls contact with backend team...', status: false })
            }
            else {
                res.status(200).json({ message: 'Category deleted successfully', status: true })
            }

        })

    }
    catch (e) {

        res.status(200).json({ message: 'Severe error on server pls contact with backend team', status: false })
    }
});




router.get('/display_all_subcategory', function (req, res, next) {
    try {
        pool.query("select SC.*,(select C.categoryname from category C where C.categoryid=SC.categoryid) as categoryname from subcategory SC", function (error, result) {
            if (error) {
                console.log(error)
                res.status(200).json({ message: 'Database Error Pls contact with backend team...', status: false })
            }
            else {
                res.status(200).json({ message: 'Success', data: result, status: true })
            }

        })

    }
    catch (e) {

        res.status(200).json({ message: 'Severe error on server pls contact with backend team', status: false })
    }
});




router.post('/get_all_subcategory_by_categoryid', function (req, res, next) {
    try {
        pool.query("select SC.*,(select C.categoryname from category C where C.categoryid=SC.categoryid) as categoryname from subcategory SC where SC.categoryid=?",[req.body.categoryid], function (error, result) {
            if (error) {
                console.log(error)
                res.status(200).json({ message: 'Database Error Pls contact with backend team...', status: false })
            }
            else {
                res.status(200).json({ message: 'Success', data: result, status: true })
            }

        })

    }
    catch (e) {

        res.status(200).json({ message: 'Severe error on server pls contact with backend team', status: false })
    }
});

module.exports = router;