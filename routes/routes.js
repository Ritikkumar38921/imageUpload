const router = require('express').Router();
let {updatePost} = require("../controllers/controller");
let {deletePost} = require("../controllers/controller");
// let {allPosts} = require("../controllers/controller");
// let {uploadPost} = require("../controllers/controller");



// router.get('/',allPosts);
router.put('/:id',updatePost)
 router.delete('/:id',deletePost);


module.exports = router;