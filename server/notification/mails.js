import User from '../models/User.js';
import Blog from '../models/post.js';
import { urlTracker } from '../models/urlTracker.js';
import { createTransport } from 'nodemailer';

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: 'shuklalok2545@gmail.com',
    pass: 'lljpbdqfmgmgstpd', 
  },
});


export const allusers = async () => {
  try {
    // Fetching all users
    const users = await User.find({}, { name: 1, email: 1, _id: 0 });

    // Geting the latest blog
    const latestBlog = await Blog.findOne({}, { fileType: 1, secure_url: 1 }).sort({ createdAt: -1 });

    if (!latestBlog) return;

    const currUrl = latestBlog.secure_url;
    const fileType = latestBlog.fileType;

    // Geting previous URL
    const tracker = await urlTracker.findOne().sort({ createdAt: -1 });

    // Only send email if the URL is new
    if (!tracker || currUrl !== tracker.lastUrl) {
      // Update the tracker
      await urlTracker.create({ lastUrl: currUrl });

      for (const user of users) {
        try {
          const info = await transporter.sendMail({
            from: 'acker25459850@gmail.com',
            to: user.email,
            subject: 'New post Uploaded on NIT SGR Blogs',
            text: `Hi ${user.name},

                NITSXR Blogs has uploaded a new ${fileType}.
                You can view it securely at: ${currUrl}
                To explore more blogs, visit: https://nitsxrblogs.netlify.app/blogs
                Regards,
                NITSXR Blogs Team`
          });

          console.log(`✅ Email sent to ${user.email}:`, info.response);
        } catch (error) {
          console.log(`❌ Error sending to ${user.email}:`, error.message);
        }
      }
    } else {
      console.log('No new blog to send.');
    }
  } catch (err) {
    console.log(err);
  }
};



