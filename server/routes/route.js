import express from 'express'
import { upload,cloudinary } from '../cloudinary/cloud.js'
import User from "../models/User.js";
import Counts from '../models/likeSharecount.js';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import fs from 'fs'
import Blog from '../models/post.js'

dotenv.config();

const router = express.Router();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASS = process.env.ADMIN_PASS;
const JWT_SECRET = process.env.JWT_SECRET;


// admin Login
router.post('/login', (req, res) => {
  let { mail, password } = req.body;

  if (!mail || !password) {
      return res.status(400).json({ message: 'Missing credentials' });
  }
  if (mail === ADMIN_EMAIL && password === ADMIN_PASS) {
      const token = jwt.sign({ mail }, JWT_SECRET, { expiresIn: '10m' });
      return res.json({ token });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});


//admin-uploads
router.post('/upload', upload.single("file"), async (req, res) => {
  try {
      const file = req.file;
      const result = await cloudinary.uploader.upload(file.path, { resource_type: 'auto' });
      fs.unlinkSync(file.path); 

      const blog = new Blog({
          public_id: result.public_id,
          secure_url: result.secure_url,
          fileType: result.resource_type,
      });
      await blog.save();

      res.json({
          url: result.secure_url, 
          public_id: result.public_id,
          fileType: result.resource_type
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Upload failed" });
  }
});


  //google-login
  router.post("/api/auth/google-login", async (req, res) => {
    try {
      const { googleId, name, email, avatar } = req.body;
  
      if (!googleId || !email) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      let user = await User.findOne({ googleId });
  
      if (!user) {
        user = new User({ googleId, name, email, avatar });
        // console.log(user)
        await user.save();
        console.log("🆕 New User Created:", user.email);
      } else {
        console.log("👤 User logged in:", user.email);
      }
  
      res.json({ message: "Login successful", user });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });




// Helper to map DB doc to API shape
const mapDoc = (d) => ({
  public_id: d.public_id,
  url: d.secure_url,       // <- frontend expects `.url`
  fileType: d.fileType,
  createdAt: d.createdAt,
});


//Home page – latest 6 videos
router.get("/api/home/videos", async (req, res) => {
  try {
    const docs = await Blog.find({ fileType: "video" })
      .sort({ createdAt: -1 })
      .limit(6)
      .select("public_id secure_url fileType createdAt");

    const videos = docs.map(mapDoc);
    res.json({ videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch videos" });
  }
});

//videos-fetcing for blogs
router.get("/api/blogs/videos", async (req, res) => {
  try {
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const page = parseInt(req.query.page || req.query.nextCursor) || 1;
    const skip = (page - 1) * limit;

    const [total, docs] = await Promise.all([
      Blog.countDocuments({ fileType: "video" }),
      Blog.find({ fileType: "video" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("public_id secure_url fileType createdAt"),
    ]);

    const videos = docs.map(mapDoc);
    const hasMore = skip + docs.length < total;
    const nextCursor = hasMore ? String(page + 1) : null;
    res.json({ videos, nextCursor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch videos" });
  }
});


//images-fetcing for blogs
router.get("/api/blogs/images", async (req, res) => {
  try {
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const page = parseInt(req.query.page || req.query.nextCursor) || 1;
    const skip = (page - 1) * limit;

    const [total, docs] = await Promise.all([
      Blog.countDocuments({ fileType: "image" }),
      Blog.find({ fileType: "image" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("public_id secure_url fileType createdAt"),
    ]);

    const images = docs.map(mapDoc);
    const hasMore = skip + docs.length < total;
    const nextCursor = hasMore ? String(page + 1) : null;
    res.json({ images, nextCursor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch images" });
  }
});



  //setting-likes
  router.post('/likesCount', async (req, res) => {
    const { public_id, isLiked } = req.body;
    if (!public_id) return res.status(400).json('some data is missing');
  
    try {
      const update = await Counts.findOneAndUpdate(
        { public_id },
        { $inc: { likeCount: isLiked ? 1 : -1 } },
        { new: true, upsert: true }
      );
  
      if (update.likeCount < 0) {
        update.likeCount = 0;
        await update.save();
      }
  
      res.json({
        public_id: update.public_id,
        likeCount: update.likeCount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  
  //fetching-total-likes
  router.get('/api/totallikes', async (req, res) => {
    try {
      const counts = await Counts.find({}, 'public_id likeCount -_id');
      
      const result = {};
      counts.forEach(c => {
        result[c.public_id] = c.likeCount;
      });
  
      res.json(result);
    } catch (error) {
      console.error("Error fetching total likes:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

  //setting-shares
  router.post('/shareCount',async (req,res)=>{
    const {id} = req.body;
    if(!id) return res.status(400).json('some data is missing');
    try{
      const update = await Counts.findOneAndUpdate(
        {public_id: id},
        {$inc:{shareCount:1}},
        {new:true,upsert:true}
      )
      res.json({public_id:update.public_id,shareCount:update.shareCount})
    }catch(error){
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  })


  //fetching-share
  router.get('/api/totalShares', async (req, res) => {
    try {
      const counts = await Counts.find({}, 'public_id shareCount -_id');
      
      const result = {};
      counts.forEach(c => {
        result[c.public_id] = c.shareCount;
      });
      res.json(result);
    } catch (error) {
      console.error("Error fetching total likes:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

  
export default router;
