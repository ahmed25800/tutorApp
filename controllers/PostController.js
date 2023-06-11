const Post = require("../models/Post");
const base = require("../base46_helper");

exports.SavePost = (req, res, next) => {
    const teacher_id = req.body.teacher_id;
    const title = req.body.title;
    const body = req.body.body;
    const image = req.body.image;
    const imagePath = base(image);

    const postModel = new Post({
        Author: teacher_id,
        title : title,
        date: Date.now(),
        body : body,
        image_path :imagePath
    });
    postModel.save()
        .then((postRes) => {
            res.status(200).json({
                Message: "Post Added Successfully",
                post: postRes,
            });
        })
        .catch((error) => {
            error.statusCode = 500;
            next(error);
        });
};

exports.DeletePost = (req, res, next) => {
    const post_id = req.params.post_id;
    Post.deleteOne({_id:post_id}).then(dres=>{
        res.status(200).json({
            Message: "Post Deleted Successfully",
            post: dres,
        });
    });

};


exports.getTeacherPosts = (req, res, next) => {
    const teacherId = req.params.teacher_id;
    Post.find({
        author_id: teacherId,
    })
        .sort({ date: -1 })
        .populate(["author_id"])
        .then((posts) => {
            res.status(200).json(posts);
        });
};
