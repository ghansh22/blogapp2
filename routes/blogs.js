const mongoose = require('mongoose');
const User = require('../models/user');
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) =>{

/*===================================================
newBLog creation
===================================================*/  
  router.post('/newBlog',(req, res)=>{
    if(!req.body.title){
      res.json({
        success: false,
        message: 'title not found'
      });
    }else{
      if(!req.body.body){
        res.json({
          success: false,
          message: 'blog body not found'
        });
      }else{
        if(!req.body.createdBy){
          res.json({
            success: false,
            message: 'author not found'
          });
        }else{
          const blog = new Blog({
            title: req.body.title,
            body: req.body.body,
            createdBy: req.body.createdBy
          });
          blog.save((error)=>{
            if(error){
              if(error.errors){
                if(error.errors.title){
                  res.json({
                    success: false,
                    message: error.errors.title.message
                  });
                }else{
                  if(error.errors.body){
                    res.json({
                        success: false,
                        message: error.errors.body.message
                    });
                  }else{
                    res.json({
                        success: false,
                        message: error
                    });
                  }
                }
              }
            }else{
              res.json({
                success: true,
                message: 'Blog saved!'
              });
            }
          });
        }
      }
    }
  });

/*===================================================
getting all blogs
===================================================*/  
  router.get('/allBlogs',(req, res)=>{
    Blog.find({},(error,blogs)=>{
      if(error){
        res.json({
          success: false,
          message: error
        });
      }else{
        if(!blogs){
          res.json({
            success: false,
            message: 'No blogs found! Please create one.'
          });
        }else{
          res.json({
            success: true,
            blogs: blogs
          });
        }
      }
    }).sort({'_id': -1});
  });

/*===================================================
getting single blog using id
===================================================*/
  router.get('/singleBlog/:id', (req, res) =>{
    if(!req.params.id){
      res.json({
        success: false,
        message:'No blog id provided.'
      });
    }else{
      Blog.findOne({_id: req.params.id}, (error, blog)=>{
        if(error){
          res.json({
            success: false,
            message: 'not a valid blog id: '+error
          });
        }else{
          if(!blog){
            res.json({
              success: false,
              message: 'no blog found.'
            });
          }else{
            User.findOne({ _id: req.decoded.userId }, (error, user)=>{
              if(error){
                res.json({
                  success: false,
                  message: error
                });
              }else{
                if(!user){
                  res.json({
                    success: false,
                    message: 'Unable to authenticate the user'
                  });
                }else{
                  if(user.username !== blog.createdBy){
                    res.json({
                      success: false,
                      message: 'you are not autherized to edit this blog post'
                    });
                  }else{
                    res.json({
                      success: true,
                      blog: blog
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  });  

/*===================================================
updating an existing blog
===================================================*/
  router.put('/updateBlog',(req, res)=>{
    if(!req.body._id){
      res.json({
        success: false,
        message: 'Please provide blog id'
      });
    }else{
      Blog.findOne({ _id:req.body._id},(error,blog)=>{
        if(error){
          res.json({
            success: false,
            message: 'Something went wrong! '+error
          });
        }else{
          if(!blog){
            res.json({
              success: false,
              message: 'No blog with such id'
            });
          }else{
            User.findOne({ _id: req.decoded.userId },(error, user)=>{
              if(error){
                res.json({
                  success: false,
                  message: 'Something went wrong! '+error
                });
              }else{
                if(!user){
                  res.json({
                    success: false,
                    message: 'unable to authenticate the user'
                  });
                }else{
                  if(user.username !== blog.createdBy){
                    res.json({
                      success: false,
                      message: 'You are not authenticate to edit this blog!'
                    });
                  }else{
                    blog.title = req.body.title;
                    blog.body = req.body.body;
                    blog.save((error)=>{
                      if(error){
                        if(error.errors){
                          if(error.errors.title){
                            res.json({
                              success: false,
                              message: error.errors.title.message
                            });
                          }else{
                            if(error.errors.body){
                              res.json({
                                success: false,
                                message: error.errors.body.message
                              });
                            }else{
                              res.json({
                                success: false,
                                message: error.errmsg
                              });
                            }
                          }
                        }else{
                          res.json({
                            success: false,
                            message: 'Something went wrong! '+error
                          });
                        }
                      }else{
                        res.json({
                          success: true,
                          message: 'Blog updated!'
                        });
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  });

/*===================================================
blog deletion
===================================================*/
  router.delete('/deleteBlog/:id',(req,res)=>{
    if(!req.params.id){
      res.json({
        success: false,
        message: 'id not found'
      });
    }else{
      Blog.findOne({ _id:req.params.id}, (error, blog)=>{
        if(error){
          res.json({
            success: false,
            message: error
          });
        }else{
          if(!blog){
            res.json({
              success: false,
              message: 'No blog with such id'
            });
          }else{
            User.findOne( {_id:req.decoded.userId},(error,user)=>{
              if(error){
                res.json({
                  success: false,
                  message: error
                });
              }else{
                if(!user){
                  res.json({
                    success: false,
                    message: 'Unable to authenticate the user'
                  });
                }else{
                  if( user.username !== blog.createdBy){
                    res.json({
                      success: false,
                      message: 'You are not authenticated to delete this blog!'
                    });
                  }else{
                    blog.remove((error)=>{
                      if(error){
                        res.json({
                          success: false,
                          message: 'Something went wrong!'+error
                        });
                      }else{
                        res.json({
                          success: true,
                          message: 'blog deleted!'
                        });
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  });

/*===================================================
blog like route
===================================================*/  
  router.put('/likeBlog',(req,res)=>{
    if(!req.body.id){
      res.json({
        success: false,
        message: 'Id not found!'
      });
    }else{
      Blog.findOne({ _id: req.body.id},(error, blog)=>{
        if(error){
          res.json({
            success: false,
            message: error
          });
        }else{
          if(!blog){
            res.json({
              success: false,
              message: 'No blog found!'
            });
          }else{
            User.findOne({ _id:req.decoded.userId},(error,user)=>{
              if(error){
                res.json({
                  success: false,
                  message: error
                });
              }else{
                if(!user){
                  res.json({
                    success: false,
                    message: 'Unable to authenticate the user!'
                  });
                }else{
                  if(user.username === blog.createdBy){
                    res.json({
                      success: false,
                      message: 'Not allowed to like your own blog post!'
                    });
                  }else{
                    if(blog.likedBy.includes(user.username)){
                      res.json({
                        success: false,
                        message: 'You have already liked this post!'
                      });
                    }else{
                      if(blog.dislikedBy.includes(user.username)){
                        blog.dislikes--;
                        const arrayIndex = blog.dislikedBy.indexOf(user.username);
                        blog.dislikedBy.splice(arrayIndex,1);
                        blog.likes++;
                        blog.likedBy.push(user.username);
                        blog.save((error)=>{
                          if(error){
                            res.json({
                              success: false,
                              message: error
                            });
                          }else{
                            res.json({
                              success: true,
                              message: 'You liked blog!'
                            });
                          }
                        });
                      }else{
                        blog.likes++;
                        blog.likedBy.push(user.username);
                        blog.save((error)=>{
                          if(error){
                            res.json({
                              success: false,
                              message: error
                            });
                          }else{
                            res.json({
                              success: true,
                              message: 'You liked blog!'
                            });
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });        
    }
  });

/*===================================================
blog dislike route
===================================================*/
  router.put('/dislikeBlog',(req,res)=>{
    if(!req.body.id){
      res.json({
        success: false,
        message: 'Id not found!'
      });
    }else{
      Blog.findOne({ _id: req.body.id},(error, blog)=>{
        if(error){
          res.json({
            success: false,
            message: error
          });
        }else{
          if(!blog){
            res.json({
              success: false,
              message: 'No blog found!'
            });
          }else{
            User.findOne({ _id:req.decoded.userId},(error,user)=>{
              if(error){
                res.json({
                  success: false,
                  message: error
                });
              }else{
                if(!user){
                  res.json({
                    success: false,
                    message: 'Unable to authenticate the user!'
                  });
                }else{
                  if(user.username === blog.createdBy){
                    res.json({
                      success: false,
                      message: 'Not allowed to dislike your own blog post!'
                    });
                  }else{
                    if(blog.dislikedBy.includes(user.username)){
                      res.json({
                        success: false,
                        message: 'Ypu have already disliked this post!'
                      });
                    }else{
                      if(blog.likedBy.includes(user.username)){
                        blog.likes--;
                        const arrayIndex = blog.likedBy.indexOf(user.username);
                        blog.likedBy.splice(arrayIndex,1);
                        blog.dislikes++;
                        blog.dislikedBy.push(user.username);
                        blog.save((error)=>{
                          if(error){
                            res.json({
                              success: false,
                              message: error
                            });
                          }else{
                            res.json({
                              success: true,
                              message: 'You disliked blog!'
                            });
                          }
                        });
                      }else{
                        blog.dislikes++;
                        blog.dislikedBy.push(user.username);
                        blog.save((error)=>{
                          if(error){
                            res.json({
                              success: false,
                              message: error
                            });
                          }else{
                            res.json({
                              success: true,
                              message: 'You disliked blog!'
                            });
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });        
    }
  });
  return router;
};