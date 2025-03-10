
# Sancity Blogs
This is a full-stack weblog project called Sancity Blogs developed in docker. This project doesn't have a professional UI, cause im not a frontend developer :)
Please follow these steps to setup the project.

**Note:** <mark>Make sure your local 8081 port number is free, the project will be hosted on this port.</mark>

For better experience use Chrome browser.

## Setup
1. Run the docker engine
2. Add hostnames of project to your hosts file (MAC/LINUX)
```
echo "127.0.0.1 sancity.blog" | sudo tee -a /etc/hosts
echo "127.0.0.1 ws.sancity.blog" | sudo tee -a /etc/hosts
```

3. Clone the repository
```
git clone git@github.com:aminsec/Sancity-Blogs.git
```

3. Change the directory
```
cd Sancity-Blogs
```

4. Run the compose file
```
docker compose up
```

5. Open Chrome and hit this address
```
http://sancity.blog:8081/
```

Enjoy 🙌

## Technologies Used
|   Technology  |                                         Description                                        |
|:-------------:|:------------------------------------------------------------------------------------------:|
|       AI      | Connected AI to provide some features like summarizing                                     |
|   Express.js  | Used Express.js framework in Backend development                                           |
|     React     | Used React in Frontend development                                                         |
|     MySQL     | Used MySql as main database                                                                |
|   Sequelize   | Used Sequelize ORM for database connections                                                |
|   Websocket   | Used Websockets to build real-time connection for chat feature                             |
| Microservices | Deployed application in Microservices structure to build fast and maintainable application |
|      JWT      | Used JWT in authentication system                                          |
|    REST API   | Used REST API as an intermediary between Frontend and Backend                              |
|      JSON     | Used JSON as REST API communication format                                                 |
|      etc      | And other technologies...                                                                  |


## Some of Features
|          Feature          |                                                                                                                     Description                                                                                                                     |
|:-------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|      Creating account     | You can create you own account and start writing blogs                                                                                                                                                                                              |
|        Writing blog       | You can start writing blogs and publishing them to explore                                                                                                                                                                                          |
|            Chat           | Chatting is one of features in this app.  You can start chatting with your friends and share your ideas together                                                                                                                                    |
|    Public/Private blogs   | You can make your blogs private or public to everyone                                                                                                                                                                                               |
|          Magic link       | There is only one way to see private blogs, and that's Magic Link. You can generate a magic link to your private blog and share it with  your friends to read your blog. But for security reasons, the link will be available for only 5 minutes.   |
|       Notifications       | With notifications, you can stay informed about what's happening on your blogs.                                                                                                                                                                     |
|        Liking blogs       | If you interested in a blog, you can drop a like for it. And the blog will be shown in Liked Blogs section in dashboard                                                                                                                             |
|        Saving blogs       | If you found an important or useful blog, you can save it. The blog will be shown in  Saved Blogs section in dashboard                                                                                                                              |
|        Commenting         | You can drop a comment on blogs and share your ideas                                                                                                                                                                                                |
|       Liking comment      | If you agree with someone's comment, you can like their comment.                                                                                                                                                                                    |
|           Search          | You can search and find blog in any subject                                                                                                                                                                                                         |
|  Summarization blog by AI | If you would like read a blog, but you didn't have much time, you can  use Summarization feature that uses AI to make a summary for you. You can use this feature  only 5 times in a day.                                                           |
|       Autogen by AI       | You will always have a new blog to read. The AI will write and public a new blog for everyone every 30 minutes                                                                                                                                      |
|            etc            | There are so many other features in this webapp that you can explore by setting up the project.                                                                                                                                                     |

