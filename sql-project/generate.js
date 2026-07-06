const fs = require('fs');

const CATEGORIES = {
  'SELECT': [1,2,3,4,5,6,7,8,9,10],
  'COUNT': [11,12],
  'GROUP BY': [13,14,15],
  'AVG': [16,20],
  'MAX, MIN': [17],
  'SUM': [18],
  'null Handling': [19],
  'GROUP BY, ORDER BY, LIMIT': [21,22],
  'JOIN, ORDER BY': [23],
  'GROUP BY': [24,25,26,27],
  'WHERE': [28],
  'Date Functions': [29],
  'GROUP BY, Date Functions': [30],
  'INNER JOIN': [31],
  'Multi-table JOIN, GROUP BY': [32],
  'JOIN, Aggregation': [33],
  'LEFT JOIN, HAVING': [34],
  'JOIN, AVG': [35],
  'JOIN, SUM': [36],
  'JOIN, WHERE': [37],
  'JOIN, SUM, LIMIT': [38],
  'JOIN, WHERE': [39],
  'LEFT JOIN': [40],
  'CASE WHEN': [41],
  'Subquery': [42],
  'GROUP BY, HAVING, Subquery': [43],
  'Correlated Subquery': [44],
  'GROUP BY, HAVING': [45],
  'CTE, Window Function': [46,47],
  'Date Functions, GROUP BY': [48],
  'CTE, Aggregation': [49],
  'CTE, Window Function, JOIN': [50]
};

const DIFFICULTIES = {
  1:'Easy',2:'Easy',3:'Easy',4:'Easy',5:'Easy',6:'Easy',7:'Easy',8:'Easy',9:'Easy',10:'Easy',
  11:'Easy',12:'Easy',13:'Easy',14:'Easy',15:'Easy',16:'Easy',17:'Easy',18:'Easy',19:'Easy',20:'Easy',
  21:'Medium',22:'Medium',23:'Medium',24:'Medium',25:'Medium',26:'Medium',27:'Medium',28:'Medium',29:'Medium',30:'Medium',
  31:'Medium',32:'Medium',33:'Medium',34:'Medium',35:'Medium',36:'Medium',37:'Medium',38:'Medium',39:'Medium',40:'Medium',
  41:'Hard',42:'Hard',43:'Hard',44:'Hard',45:'Hard',46:'Medium',47:'Hard',48:'Hard',49:'Hard',50:'Hard'
};

function p(id, title, desc, tables, hint, solution, explanation, topics, schema, sampleData, outputCols, outputRows) {
  return { id, title, difficulty: DIFFICULTIES[id], topics: Array.isArray(topics) ? topics : [topics], description: desc, tables, hint, solution, explanation, schema, sample_data: sampleData, expected_output: { columns: outputCols, rows: outputRows } };
}

// ---- MASTER SCHEMA ----
const masterSchema = {
  channels: "channel_id VARCHAR PRIMARY KEY, channel_name VARCHAR, subscriber_count BIGINT, view_count BIGINT, country VARCHAR, subscriber_hidden BOOLEAN, default_language VARCHAR, published_at DATE, video_count INT",
  videos: "video_id VARCHAR PRIMARY KEY, channel_id VARCHAR REFERENCES channels(channel_id), title VARCHAR, publish_date DATE, definition VARCHAR, duration INT, privacy_status VARCHAR, embeddable BOOLEAN, made_for_kids BOOLEAN, caption BOOLEAN, upload_status VARCHAR, live_broadcast_content VARCHAR, views BIGINT, likes BIGINT, comment_count INT, comments_disabled BOOLEAN",
  video_stats: "stat_id INT PRIMARY KEY, video_id VARCHAR REFERENCES videos(video_id), views BIGINT, likes BIGINT, comments INT, watch_time_hours FLOAT",
  comments: "comment_id VARCHAR PRIMARY KEY, video_id VARCHAR REFERENCES videos(video_id), channel_id VARCHAR REFERENCES channels(channel_id), author_name VARCHAR, text TEXT, like_count INT, published_at DATE",
  replies: "reply_id VARCHAR PRIMARY KEY, comment_id VARCHAR REFERENCES comments(comment_id), author_name VARCHAR, text TEXT, like_count INT, published_at DATE",
  playlists: "playlist_id VARCHAR PRIMARY KEY, channel_id VARCHAR REFERENCES channels(channel_id), title VARCHAR, item_count INT, privacy_status VARCHAR",
  playlist_items: "playlist_item_id VARCHAR PRIMARY KEY, playlist_id VARCHAR REFERENCES playlists(playlist_id), video_id VARCHAR REFERENCES videos(video_id), position INT, added_at DATE"
};

const problems = [
  // ===== SELECT =====
  p(1, 'Channel Names and Subscribers', 'Write a SQL query to display the channel_name and subscriber_count for all channels.',
    ['channels'], 'Use a simple SELECT with column names from one table.',
    'SELECT channel_name, subscriber_count FROM channels;',
    'The query selects only the requested columns from the channels table. SELECT specifies which columns to retrieve, FROM specifies the table.',
    'SELECT',
    `CREATE TABLE channels (${masterSchema.channels});`,
    { channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89),('C104','CodeCraft',3200000,150000000,'US',true,'en','2014-06-01',560),('C105','Analytics Hub',500000,18000000,'IN',false,'hi','2020-11-15',45)" },
    ['channel_name', 'subscriber_count'],
    [['Alpha Tech', 2500000], ['Data With Mira', 1800000], ['SQL Zone', 950000], ['CodeCraft', 3200000], ['Analytics Hub', 500000]]
  ),

  p(2, 'First 10 Videos by Publish Date', 'Write a query to display the video_id, title, and publish_date for the first 10 most recently published videos.',
    ['videos'], 'Use ORDER BY with DESC on publish_date, then LIMIT 10.',
    'SELECT video_id, title, publish_date FROM videos ORDER BY publish_date DESC LIMIT 10;',
    'ORDER BY publish_date DESC sorts newest first. LIMIT 10 returns only the first 10 rows.',
    'SELECT, ORDER BY, LIMIT',
    `CREATE TABLE videos (${masterSchema.videos});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V204','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'public',true,false,true,'processed','none',67000,5400,89,false),('V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false),('V206','C102','Advanced SQL Queries','2024-11-15','hd',1800,'public',true,false,false,'processed','upcoming',120000,10200,230,false),('V207','C105','Excel Tips & Tricks','2024-11-10','sd',900,'public',true,false,true,'processed','none',34000,2800,45,false),('V208','C104','Deep Learning Explained','2024-11-05','hd',2400,'public',true,false,true,'processed','none',560000,42000,1100,false),('V209','C101','CSS Flexbox Guide','2024-11-01','hd',1500,'public',true,false,false,'processed','none',98000,7600,180,false),('V210','C103','Power BI Dashboard','2024-10-28','hd',1200,'unlisted',true,false,true,'processed','none',45000,3800,67,false),('V211','C102','Database Normalization','2024-10-25','hd',2100,'public',true,false,true,'processed','none',76000,6100,134,false),('V212','C105','Tableau for Beginners','2024-10-20','sd',1800,'public',true,false,true,'processed','none',28000,2100,34,false)" },
    ['video_id', 'title', 'publish_date'],
    [['V201','Getting Started with Python','2024-12-01'],['V202','SQL Masterclass Part 1','2024-11-28'],['V203','Data Science 101','2024-11-25'],['V204','Learn Pandas in 1 Hour','2024-11-20'],['V205','Machine Learning Basics','2024-11-18'],['V206','Advanced SQL Queries','2024-11-15'],['V207','Excel Tips & Tricks','2024-11-10'],['V208','Deep Learning Explained','2024-11-05'],['V209','CSS Flexbox Guide','2024-11-01'],['V210','Power BI Dashboard','2024-10-28']]
  ),

  p(3, 'Channels from India', 'Write a SQL query to display all channel details for channels located in India.',
    ['channels'], "Use WHERE clause to filter rows where country = 'IN'.",
    "SELECT * FROM channels WHERE country = 'IN';",
    'The WHERE clause filters rows based on a condition. Use single quotes for string comparison.',
    'WHERE',
    `CREATE TABLE channels (${masterSchema.channels});`,
    { channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89),('C104','CodeCraft',3200000,150000000,'US',true,'en','2014-06-01',560),('C105','Analytics Hub',500000,18000000,'IN',false,'hi','2020-11-15',45),('C106','LearnTech India',1200000,45000000,'IN',false,'hi','2018-03-22',210)" },
    ['channel_id','channel_name','subscriber_count','view_count','country','subscriber_hidden','default_language','published_at','video_count'],
    [['C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340],['C105','Analytics Hub',500000,18000000,'IN',false,'hi','2020-11-15',45],['C106','LearnTech India',1200000,45000000,'IN',false,'hi','2018-03-22',210]]
  ),

  p(4, 'Public Videos', "Write a query to display all videos that have a privacy status of 'public'.",
    ['videos'], "Filter using WHERE privacy_status = 'public'.",
    "SELECT * FROM videos WHERE privacy_status = 'public';",
    'WHERE clause filters rows. Videos can be public, unlisted, or private.',
    'WHERE',
    `CREATE TABLE videos (${masterSchema.videos});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'private',true,false,true,'processed','none',0,0,0,true),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V204','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'unlisted',true,false,true,'processed','none',67000,5400,89,false),('V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false),('V206','C102','Advanced SQL Queries','2024-11-15','hd',1800,'public',true,false,false,'processed','upcoming',120000,10200,230,false)" },
    ['video_id','channel_id','title','publish_date','definition','duration','privacy_status','embeddable','made_for_kids','caption','upload_status','live_broadcast_content','views','likes','comment_count','comments_disabled'],
    [['V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false],['V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false],['V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false],['V206','C102','Advanced SQL Queries','2024-11-15','hd',1800,'public',true,false,false,'processed','upcoming',120000,10200,230,false]]
  ),

  p(5, 'HD Videos', 'Write a query to display all videos that are in HD definition.',
    ['videos'], "Filter using WHERE definition = 'hd'.",
    "SELECT * FROM videos WHERE definition = 'hd';",
    "The definition column stores video quality - 'hd' for high definition, 'sd' for standard.",
    'WHERE',
    `CREATE TABLE videos (${masterSchema.videos});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V203','C101','Data Science 101','2024-11-25','sd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V204','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'public',true,false,true,'processed','none',67000,5400,89,false),('V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false),('V207','C105','Excel Tips & Tricks','2024-11-10','sd',900,'public',true,false,true,'processed','none',34000,2800,45,false)" },
    ['video_id','channel_id','title','publish_date','definition','duration','privacy_status','embeddable','made_for_kids','caption','upload_status','live_broadcast_content','views','likes','comment_count','comments_disabled'],
    [['V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false],['V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false],['V204','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'public',true,false,true,'processed','none',67000,5400,89,false],['V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false]]
  ),

  p(6, 'Videos with Captions', 'Display all videos that have captions enabled.',
    ['videos'], 'Filter using WHERE caption = true.',
    'SELECT * FROM videos WHERE caption = true;',
    'The caption column is a boolean field indicating whether closed captions are available.',
    'WHERE',
    `CREATE TABLE videos (${masterSchema.videos});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V204','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'public',true,false,false,'processed','none',67000,5400,89,false),('V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false)" },
    ['video_id','channel_id','title','publish_date','definition','duration','privacy_status','embeddable','made_for_kids','caption','upload_status','live_broadcast_content','views','likes','comment_count','comments_disabled'],
    [['V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false],['V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false],['V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false]]
  ),

  p(7, 'Channels with Hidden Subscriber Count', 'Display all channels that have their subscriber count hidden.',
    ['channels'], 'Filter using WHERE subscriber_hidden = true.',
    'SELECT * FROM channels WHERE subscriber_hidden = true;',
    'Some channels choose to hide their subscriber count. This is stored as a boolean flag.',
    'WHERE',
    `CREATE TABLE channels (${masterSchema.channels});`,
    { channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89),('C104','CodeCraft',3200000,150000000,'US',true,'en','2014-06-01',560),('C105','Analytics Hub',500000,18000000,'IN',false,'hi','2020-11-15',45),('C106','LearnTech India',1200000,45000000,'IN',false,'hi','2018-03-22',210),('C107','Secret Channel',100000,5000000,'JP',true,'ja','2021-07-01',15)" },
    ['channel_id','channel_name','subscriber_count','view_count','country','subscriber_hidden','default_language','published_at','video_count'],
    [['C104','CodeCraft',3200000,150000000,'US',true,'en','2014-06-01',560],['C107','Secret Channel',100000,5000000,'JP',true,'ja','2021-07-01',15]]
  ),

  p(8, 'Successfully Processed Videos', "Display all videos that have been successfully processed (upload_status = 'processed').",
    ['videos'], "Filter using WHERE upload_status = 'processed'.",
    "SELECT * FROM videos WHERE upload_status = 'processed';",
    'The upload_status indicates whether a video has finished processing after upload.',
    'WHERE',
    `CREATE TABLE videos (${masterSchema.videos});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'failed','none',0,0,0,true),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V204','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'public',true,false,true,'processed','none',67000,5400,89,false),('V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false),('V206','C102','Advanced SQL Queries','2024-11-15','hd',1800,'public',true,false,false,'processing','upcoming',0,0,0,false)" },
    ['video_id','channel_id','title','publish_date','definition','duration','privacy_status','embeddable','made_for_kids','caption','upload_status','live_broadcast_content','views','likes','comment_count','comments_disabled'],
    [['V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false],['V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false],['V204','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'public',true,false,true,'processed','none',67000,5400,89,false],['V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false]]
  ),

  p(9, 'Embeddable Videos', 'Display all videos that can be embedded on other websites.',
    ['videos'], 'Filter using WHERE embeddable = true.',
    'SELECT * FROM videos WHERE embeddable = true;',
    'The embeddable column indicates if a video can be embedded on external websites.',
    'WHERE',
    `CREATE TABLE videos (${masterSchema.videos});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V204','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'public',false,false,true,'processed','none',67000,5400,89,false),('V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false)" },
    ['video_id','channel_id','title','publish_date','definition','duration','privacy_status','embeddable','made_for_kids','caption','upload_status','live_broadcast_content','views','likes','comment_count','comments_disabled'],
    [['V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false],['V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false],['V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false],['V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false]]
  ),

  p(10, 'Made for Kids Videos', 'Display all videos that are marked as made for kids.',
    ['videos'], 'Filter using WHERE made_for_kids = true.',
    'SELECT * FROM videos WHERE made_for_kids = true;',
    'The made_for_kids column indicates content created specifically for children.',
    'WHERE',
    `CREATE TABLE videos (${masterSchema.videos});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','Kids Learning ABC','2024-11-28','hd',600,'public',true,true,true,'processed','none',890000,45000,1200,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V204','C103','Nursery Rhymes','2024-11-20','hd',900,'public',true,true,true,'processed','none',1500000,78000,2300,false),('V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false)" },
    ['video_id','channel_id','title','publish_date','definition','duration','privacy_status','embeddable','made_for_kids','caption','upload_status','live_broadcast_content','views','likes','comment_count','comments_disabled'],
    [['V202','C102','Kids Learning ABC','2024-11-28','hd',600,'public',true,true,true,'processed','none',890000,45000,1200,false],['V204','C103','Nursery Rhymes','2024-11-20','hd',900,'public',true,true,true,'processed','none',1500000,78000,2300,false]]
  ),

  // ===== COUNT =====
  p(11, 'Total Number of Channels', 'Write a query to count the total number of channels in the database.',
    ['channels'], 'Use COUNT(*) to count all rows.',
    'SELECT COUNT(*) AS total_channels FROM channels;',
    'COUNT(*) counts all rows in the table. The AS keyword creates an alias for the output column.',
    'COUNT',
    `CREATE TABLE channels (${masterSchema.channels});`,
    { channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89),('C104','CodeCraft',3200000,150000000,'US',true,'en','2014-06-01',560),('C105','Analytics Hub',500000,18000000,'IN',false,'hi','2020-11-15',45)" },
    ['total_channels'],
    [[5]]
  ),

  p(12, 'Total Number of Videos', 'Write a query to count the total number of videos in the database.',
    ['videos'], 'Use COUNT(*) to count all video rows.',
    'SELECT COUNT(*) AS total_videos FROM videos;',
    'COUNT(*) counts every row, including those with null values.',
    'COUNT',
    `CREATE TABLE videos (${masterSchema.videos});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V204','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'public',true,false,true,'processed','none',67000,5400,89,false),('V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false)" },
    ['total_videos'],
    [[5]]
  ),

  // ===== GROUP BY =====
  p(13, 'Video Count by Privacy Status', 'Count how many videos exist for each privacy status.',
    ['videos'], 'Use GROUP BY privacy_status with COUNT(*).',
    'SELECT privacy_status, COUNT(*) AS video_count FROM videos GROUP BY privacy_status;',
    'GROUP BY groups rows that have the same values. COUNT(*) then counts each group.',
    'GROUP BY',
    `CREATE TABLE videos (${masterSchema.videos});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'private',true,false,true,'processed','none',0,0,0,true),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V204','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'unlisted',true,false,true,'processed','none',67000,5400,89,false),('V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false),('V206','C102','Advanced SQL Queries','2024-11-15','hd',1800,'public',true,false,false,'processed','upcoming',120000,10200,230,false)" },
    ['privacy_status', 'video_count'],
    [['private', 1], ['public', 4], ['unlisted', 1]]
  ),

  p(14, 'Video Count by Definition', 'Count how many videos exist for each video definition type (HD/SD).',
    ['videos'], 'Use GROUP BY definition with COUNT(*).',
    'SELECT definition, COUNT(*) AS video_count FROM videos GROUP BY definition;',
    'Grouping by categorical columns helps understand distribution across categories.',
    'GROUP BY',
    `CREATE TABLE videos (${masterSchema.videos});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V203','C101','Data Science 101','2024-11-25','sd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V204','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'public',true,false,true,'processed','none',67000,5400,89,false),('V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false),('V207','C105','Excel Tips & Tricks','2024-11-10','sd',900,'public',true,false,true,'processed','none',34000,2800,45,false)" },
    ['definition', 'video_count'],
    [['hd', 4], ['sd', 2]]
  ),

  p(15, 'Channel Count by Country', 'Count how many channels exist for each country.',
    ['channels'], 'Use GROUP BY country with COUNT(*).',
    'SELECT country, COUNT(*) AS channel_count FROM channels GROUP BY country;',
    'This shows the geographic distribution of YouTube channels.',
    'GROUP BY',
    `CREATE TABLE channels (${masterSchema.channels});`,
    { channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89),('C104','CodeCraft',3200000,150000000,'US',true,'en','2014-06-01',560),('C105','Analytics Hub',500000,18000000,'IN',false,'hi','2020-11-15',45),('C106','LearnTech India',1200000,45000000,'IN',false,'hi','2018-03-22',210),('C107','Coding Japan',800000,30000000,'JP',false,'ja','2016-09-10',150)" },
    ['country', 'channel_count'],
    [['IN', 3], ['JP', 1], ['UK', 1], ['US', 2]]
  ),

  // ===== AVG =====
  p(16, 'Average Subscriber Count', 'Calculate the average subscriber count across all channels.',
    ['channels'], 'Use AVG(subscriber_count).',
    'SELECT AVG(subscriber_count) AS avg_subscribers FROM channels;',
    'AVG() calculates the arithmetic mean of a numeric column, ignoring null values.',
    'AVG',
    `CREATE TABLE channels (${masterSchema.channels});`,
    { channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89),('C104','CodeCraft',3200000,150000000,'US',true,'en','2014-06-01',560),('C105','Analytics Hub',500000,18000000,'IN',false,'hi','2020-11-15',45)" },
    ['avg_subscribers'],
    [[1790000]]
  ),

  // ===== MAX, MIN =====
  p(17, 'Maximum and Minimum Subscribers', 'Find the channel with the most subscribers and the one with the fewest.',
    ['channels'], 'Use MAX() and MIN() on subscriber_count.',
    'SELECT MAX(subscriber_count) AS max_subscribers, MIN(subscriber_count) AS min_subscribers FROM channels;',
    'MAX() and MIN() return the largest and smallest values in a column.',
    'MAX, MIN',
    `CREATE TABLE channels (${masterSchema.channels});`,
    { channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89),('C104','CodeCraft',3200000,150000000,'US',true,'en','2014-06-01',560),('C105','Analytics Hub',500000,18000000,'IN',false,'hi','2020-11-15',45)" },
    ['max_subscribers', 'min_subscribers'],
    [[3200000, 500000]]
  ),

  // ===== SUM =====
  p(18, 'Total Channel Views', 'Calculate the total view count across all channels.',
    ['channels'], 'Use SUM(view_count).',
    'SELECT SUM(view_count) AS total_views FROM channels;',
    'SUM() adds up all values in a numeric column.',
    'SUM',
    `CREATE TABLE channels (${masterSchema.channels});`,
    { channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89),('C104','CodeCraft',3200000,150000000,'US',true,'en','2014-06-01',560),('C105','Analytics Hub',500000,18000000,'IN',false,'hi','2020-11-15',45)" },
    ['total_views'],
    [[371000000]]
  ),

  // ===== null Handling =====
  p(19, 'Videos Without Comment Count', 'Find all videos where the comment_count is null (comments disabled).',
    ['videos'], 'Use WHERE comment_count IS null.',
    'SELECT * FROM videos WHERE comment_count IS null;',
    'null represents missing or unknown data. Use IS null operator to check for null values, not = null.',
    'null',
    `CREATE TABLE videos (${masterSchema.videos});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,null,true),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V204','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'public',true,false,true,'processed','none',67000,5400,null,true),('V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false)" },
    ['video_id','channel_id','title','publish_date','definition','duration','privacy_status','embeddable','made_for_kids','caption','upload_status','live_broadcast_content','views','likes','comment_count','comments_disabled'],
    [['V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,null,true],['V204','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'public',true,false,true,'processed','none',67000,5400,null,true]]
  ),

  // ===== AVG =====
  p(20, 'Average Views per Video', 'Calculate the average number of views per video.',
    ['videos'], 'Use AVG(views).',
    'SELECT AVG(views) AS avg_views FROM videos;',
    'AVG() works on any numeric column to find the central tendency.',
    'AVG',
    `CREATE TABLE videos (${masterSchema.videos});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V204','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'public',true,false,true,'processed','none',67000,5400,89,false),('V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false)" },
    ['avg_views'],
    [[197200]]
  ),

  // ===== GROUP BY, ORDER BY, LIMIT =====
  p(21, 'Top 5 Countries by Number of Channels', 'Find the top 5 countries with the most YouTube channels.',
    ['channels'], 'Use GROUP BY, ORDER BY COUNT(*) DESC, LIMIT 5.',
    'SELECT country, COUNT(*) AS channel_count FROM channels GROUP BY country ORDER BY channel_count DESC LIMIT 5;',
    'Combining GROUP BY with ORDER BY and LIMIT finds the top N groups.',
    'GROUP BY, ORDER BY, LIMIT',
    `CREATE TABLE channels (${masterSchema.channels});`,
    { channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89),('C104','CodeCraft',3200000,150000000,'US',true,'en','2014-06-01',560),('C105','Analytics Hub',500000,18000000,'IN',false,'hi','2020-11-15',45),('C106','LearnTech India',1200000,45000000,'IN',false,'hi','2018-03-22',210),('C107','Coding Japan',800000,30000000,'JP',false,'ja','2016-09-10',150),('C108','Brazil Tech',600000,22000000,'BR',false,'pt','2020-01-05',80),('C109','Germany Codes',1100000,48000000,'DE',false,'de','2017-04-18',175),('C110','France AI',900000,35000000,'FR',false,'fr','2018-07-30',130),('C111','UK Tech Hub',700000,25000000,'UK',false,'en','2019-11-12',95)" },
    ['country', 'channel_count'],
    [['IN', 3], ['US', 2], ['UK', 2], ['JP', 1], ['FR', 1]]
  ),

  p(22, 'Top 10 Channels by Subscribers', 'List the top 10 channels with the most subscribers.',
    ['channels'], 'Use ORDER BY subscriber_count DESC LIMIT 10.',
    'SELECT channel_name, subscriber_count FROM channels ORDER BY subscriber_count DESC LIMIT 10;',
    'Sort by subscriber_count in descending order and show only the top 10.',
    'ORDER BY, LIMIT',
    `CREATE TABLE channels (${masterSchema.channels});`,
    { channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89),('C104','CodeCraft',3200000,150000000,'US',true,'en','2014-06-01',560),('C105','Analytics Hub',500000,18000000,'IN',false,'hi','2020-11-15',45),('C106','LearnTech India',1200000,45000000,'IN',false,'hi','2018-03-22',210),('C107','Coding Japan',800000,30000000,'JP',false,'ja','2016-09-10',150),('C108','Brazil Tech',600000,22000000,'BR',false,'pt','2020-01-05',80),('C109','Germany Codes',1100000,48000000,'DE',false,'de','2017-04-18',175),('C110','France AI',900000,35000000,'FR',false,'fr','2018-07-30',130),('C111','UK Tech Hub',700000,25000000,'UK',false,'en','2019-11-12',95),('C112','Data Science Pro',4000000,180000000,'US',false,'en','2013-02-20',890)" },
    ['channel_name', 'subscriber_count'],
    [['Data Science Pro', 4000000], ['CodeCraft', 3200000], ['Alpha Tech', 2500000], ['Data With Mira', 1800000], ['LearnTech India', 1200000], ['Germany Codes', 1100000], ['SQL Zone', 950000], ['France AI', 900000], ['Coding Japan', 800000], ['UK Tech Hub', 700000]]
  ),

  // ===== JOIN, ORDER BY =====
  p(23, 'Top 10 Videos by Views', 'Display the top 10 most viewed videos along with their channel names.',
    ['videos', 'channels'], 'Use JOIN to combine videos with channels, then ORDER BY views DESC LIMIT 10.',
    'SELECT v.title, v.views, c.channel_name FROM videos v JOIN channels c ON v.channel_id = c.channel_id ORDER BY v.views DESC LIMIT 10;',
    'JOIN combines rows from two tables based on a related column. v and c are table aliases.',
    'JOIN, ORDER BY',
    `CREATE TABLE videos (${masterSchema.videos}); CREATE TABLE channels (${masterSchema.channels});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V204','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'public',true,false,true,'processed','none',67000,5400,89,false),('V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false),('V206','C102','Advanced SQL Queries','2024-11-15','hd',1800,'public',true,false,false,'processed','upcoming',120000,10200,230,false)", channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89),('C104','CodeCraft',3200000,150000000,'US',true,'en','2014-06-01',560)" },
    ['title', 'views', 'channel_name'],
    [['Machine Learning Basics', 450000, 'CodeCraft'], ['Data Science 101', 230000, 'Alpha Tech'], ['Getting Started with Python', 150000, 'Alpha Tech'], ['Advanced SQL Queries', 120000, 'Data With Mira'], ['SQL Masterclass Part 1', 89000, 'Data With Mira'], ['Learn Pandas in 1 Hour', 67000, 'SQL Zone']]
  ),

  // ===== GROUP BY (medium) =====
  p(24, 'Number of Videos per Channel', 'Count how many videos each channel has uploaded.',
    ['videos', 'channels'], 'Use JOIN + GROUP BY + COUNT.',
    'SELECT c.channel_name, COUNT(v.video_id) AS video_count FROM channels c LEFT JOIN videos v ON c.channel_id = v.channel_id GROUP BY c.channel_name;',
    'LEFT JOIN ensures channels with zero videos also appear in the result.',
    'GROUP BY',
    `CREATE TABLE videos (${masterSchema.videos}); CREATE TABLE channels (${masterSchema.channels});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V204','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'public',true,false,true,'processed','none',67000,5400,89,false),('V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false)", channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89),('C104','CodeCraft',3200000,150000000,'US',true,'en','2014-06-01',560),('C105','Analytics Hub',500000,18000000,'IN',false,'hi','2020-11-15',45)" },
    ['channel_name', 'video_count'],
    [['Alpha Tech', 2], ['Analytics Hub', 0], ['CodeCraft', 1], ['Data With Mira', 1], ['SQL Zone', 1]]
  ),

  p(25, 'Channels with More Than 1000 Videos', 'Find channels that have uploaded more than 1000 videos.',
    ['channels'], 'Use WHERE video_count > 1000.',
    'SELECT channel_name, video_count FROM channels WHERE video_count > 1000;',
    'Filter numeric columns with comparison operators like >, <, >=, <=.',
    'GROUP BY, HAVING',
    `CREATE TABLE channels (${masterSchema.channels});`,
    { channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89),('C104','CodeCraft',3200000,150000000,'US',true,'en','2014-06-01',560),('C105','Analytics Hub',500000,18000000,'IN',false,'hi','2020-11-15',45),('C106','Big Uploader',1500000,80000000,'US',false,'en','2012-05-01',2500),('C107','Daily Vlogs',2000000,95000000,'US',false,'en','2016-08-15',5000),('C108','Content Factory',3000000,200000000,'US',false,'en','2011-03-10',10000)" },
    ['channel_name', 'video_count'],
    [['Big Uploader', 2500], ['Daily Vlogs', 5000], ['Content Factory', 10000]]
  ),

  p(26, 'Count Videos by Live Broadcast Content', 'Count how many videos exist for each live broadcast content type.',
    ['videos'], 'Use GROUP BY live_broadcast_content.',
    'SELECT live_broadcast_content, COUNT(*) AS video_count FROM videos GROUP BY live_broadcast_content;',
    'Grouping by categorical columns reveals distribution across categories.',
    'GROUP BY',
    `CREATE TABLE videos (${masterSchema.videos});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','upcoming',230000,18500,520,false),('V204','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'public',true,false,true,'processed','none',67000,5400,89,false),('V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false),('V206','C102','Live Q&A Session','2024-12-05','hd',3600,'public',true,false,true,'processed','live',50000,4000,120,false),('V207','C105','Weekly Live Stream','2024-12-03','hd',5400,'public',true,false,true,'processed','live',35000,2800,78,false)" },
    ['live_broadcast_content', 'video_count'],
    [['live', 2], ['none', 4], ['upcoming', 1]]
  ),

  p(27, 'Most Common Default Languages', 'Find the most common default languages used by channels.',
    ['channels'], 'Use GROUP BY default_language ORDER BY COUNT(*) DESC.',
    'SELECT default_language, COUNT(*) AS language_count FROM channels GROUP BY default_language ORDER BY language_count DESC;',
    'Group then sort by the count to find the most common values.',
    'GROUP BY, WHERE',
    `CREATE TABLE channels (${masterSchema.channels});`,
    { channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89),('C104','CodeCraft',3200000,150000000,'US',true,'en','2014-06-01',560),('C105','Analytics Hub',500000,18000000,'IN',false,'hi','2020-11-15',45),('C106','LearnTech India',1200000,45000000,'IN',false,'hi','2018-03-22',210),('C107','Coding Japan',800000,30000000,'JP',false,'ja','2016-09-10',150)" },
    ['default_language', 'language_count'],
    [['en', 4], ['hi', 2], ['ja', 1]]
  ),

  p(28, 'Channels with Very High Video Count', 'Find channels that have more than 500 videos uploaded.',
    ['channels'], 'Use WHERE video_count > 500.',
    'SELECT channel_name, video_count FROM channels WHERE video_count > 500;',
    'Filter numeric columns to find channels above a threshold.',
    'WHERE',
    `CREATE TABLE channels (${masterSchema.channels});`,
    { channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89),('C104','CodeCraft',3200000,150000000,'US',true,'en','2014-06-01',560),('C105','Analytics Hub',500000,18000000,'IN',false,'hi','2020-11-15',45),('C106','Big Uploader',1500000,80000000,'US',false,'en','2012-05-01',2500),('C107','Content Factory',3000000,200000000,'US',false,'en','2011-03-10',10000)" },
    ['channel_name', 'video_count'],
    [['CodeCraft', 560], ['Big Uploader', 2500], ['Content Factory', 10000]]
  ),

  p(29, 'Videos Published in 2024', 'Display all videos that were published in the year 2024.',
    ['videos'], "Use WHERE strftime('%Y', publish_date) = '2024'.",
    "SELECT * FROM videos WHERE strftime('%Y', publish_date) = '2024';",
    'strftime extracts parts of a date. %Y returns the 4-digit year.',
    'Date Functions',
    `CREATE TABLE videos (${masterSchema.videos});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V203','C101','Data Science 101','2023-12-25','hd',1800,'public',true,false,false,'processed','upcoming',230000,18500,520,false),('V204','C103','Learn Pandas in 1 Hour','2023-11-20','hd',3600,'public',true,false,true,'processed','none',67000,5400,89,false),('V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false),('V206','C102','Advanced SQL Queries','2024-10-15','hd',1800,'public',true,false,false,'processed','upcoming',120000,10200,230,false)" },
    ['video_id','channel_id','title','publish_date','definition','duration','privacy_status','embeddable','made_for_kids','caption','upload_status','live_broadcast_content','views','likes','comment_count','comments_disabled'],
    [['V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false],['V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false],['V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false],['V206','C102','Advanced SQL Queries','2024-10-15','hd',1800,'public',true,false,false,'processed','upcoming',120000,10200,230,false]]
  ),

  p(30, 'Video Count by Year', 'Count how many videos were published each year.',
    ['videos'], "Use GROUP BY strftime('%Y', publish_date).",
    "SELECT strftime('%Y', publish_date) AS year, COUNT(*) AS video_count FROM videos GROUP BY year;",
    'Extract year from dates, then group and count.',
    'GROUP BY, Date Functions',
    `CREATE TABLE videos (${masterSchema.videos});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V203','C101','Data Science 101','2023-12-25','hd',1800,'public',true,false,false,'processed','upcoming',230000,18500,520,false),('V204','C103','Learn Pandas in 1 Hour','2023-11-20','hd',3600,'public',true,false,true,'processed','none',67000,5400,89,false),('V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false),('V206','C102','Advanced SQL Queries','2025-01-15','hd',1800,'public',true,false,false,'processed','upcoming',120000,10200,230,false)" },
    ['year', 'video_count'],
    [['2023', 2], ['2024', 3], ['2025', 1]]
  ),

  p(31, 'Video Title with Channel Name', 'Display each video title alongside its channel name using a JOIN.',
    ['videos', 'channels'], 'Use INNER JOIN on channel_id.',
    "SELECT v.title, c.channel_name FROM videos v JOIN channels c ON v.channel_id = c.channel_id;",
    'JOIN combines rows from two tables. v and c are aliases for brevity.',
    'INNER JOIN',
    `CREATE TABLE videos (${masterSchema.videos}); CREATE TABLE channels (${masterSchema.channels});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false)", channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340)" },
    ['title', 'channel_name'],
    [['Getting Started with Python','Alpha Tech'],['SQL Masterclass Part 1','Data With Mira'],['Data Science 101','Alpha Tech']]
  ),

  p(32, 'Top 10 Channels by Total Video Views', 'Find the top 10 channels by total views across all their videos.',
    ['videos', 'channels'], 'Use JOIN + GROUP BY + SUM(v.views) + ORDER BY DESC + LIMIT 10.',
    "SELECT c.channel_name, SUM(v.views) AS total_views FROM videos v JOIN channels c ON v.channel_id = c.channel_id GROUP BY c.channel_name ORDER BY total_views DESC LIMIT 10;",
    'Multi-table JOINs allow aggregating related data across tables.',
    'Multi-table JOIN, GROUP BY',
    `CREATE TABLE videos (${masterSchema.videos}); CREATE TABLE channels (${masterSchema.channels});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V204','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'public',true,false,true,'processed','none',67000,5400,89,false),('V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false),('V206','C102','Advanced SQL Queries','2024-10-15','hd',1800,'public',true,false,true,'processed','none',120000,10200,230,false)", channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89),('C104','CodeCraft',3200000,150000000,'US',true,'en','2014-06-01',560)" },
    ['channel_name', 'total_views'],
    [['CodeCraft', 450000], ['Alpha Tech', 380000], ['Data With Mira', 209000], ['SQL Zone', 67000]]
  ),

  p(33, 'Compare Channel Views vs Summed Video Views', 'Compare the view_count from channels table with the sum of views from videos table.',
    ['videos', 'channels'], 'Use JOIN + GROUP BY + SUM, compare with channel view_count.',
    "SELECT c.channel_name, c.view_count AS channel_views, SUM(v.views) AS summed_video_views FROM channels c JOIN videos v ON c.channel_id = v.channel_id GROUP BY c.channel_name;",
    'This comparison can reveal discrepancies between aggregated and stored values.',
    'JOIN, Aggregation',
    `CREATE TABLE videos (${masterSchema.videos}); CREATE TABLE channels (${masterSchema.channels});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false)", channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340)" },
    ['channel_name', 'channel_views', 'summed_video_views'],
    [['Alpha Tech', 92000000, 380000], ['Data With Mira', 71000000, 89000]]
  ),

  p(34, 'Mismatch Between Channel Video Count and Dataset Video Count', 'Find channels where the actual video count differs from the stored video_count.',
    ['videos', 'channels'], 'Use LEFT JOIN + GROUP BY + HAVING to find mismatches.',
    "SELECT c.channel_name, c.video_count AS stored_count, COUNT(v.video_id) AS actual_count FROM channels c LEFT JOIN videos v ON c.channel_id = v.channel_id GROUP BY c.channel_name HAVING stored_count != actual_count;",
    'LEFT JOIN ensures all channels appear. HAVING filters groups after aggregation.',
    'LEFT JOIN, HAVING',
    `CREATE TABLE videos (${masterSchema.videos}); CREATE TABLE channels (${masterSchema.channels});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false)", channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89)" },
    ['channel_name', 'stored_count', 'actual_count'],
    [['Alpha Tech', 120, 2], ['Data With Mira', 340, 1], ['SQL Zone', 89, 0]]
  ),

  p(35, 'Average Views per Video by Channel', 'Calculate the average views per video for each channel.',
    ['videos', 'channels'], 'Use JOIN + GROUP BY + AVG.',
    "SELECT c.channel_name, AVG(v.views) AS avg_views FROM videos v JOIN channels c ON v.channel_id = c.channel_id GROUP BY c.channel_name;",
    'AVG within groups shows performance differences between channels.',
    'JOIN, AVG',
    `CREATE TABLE videos (${masterSchema.videos}); CREATE TABLE channels (${masterSchema.channels});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false)", channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340)" },
    ['channel_name', 'avg_views'],
    [['Alpha Tech', 190000], ['Data With Mira', 89000]]
  ),

  p(36, 'Total Likes by Channel', 'Calculate the total number of likes received by each channel across all videos.',
    ['videos', 'channels'], 'Use JOIN + GROUP BY + SUM(likes).',
    "SELECT c.channel_name, SUM(v.likes) AS total_likes FROM videos v JOIN channels c ON v.channel_id = c.channel_id GROUP BY c.channel_name;",
    'SUM adds up all like counts per channel.',
    'JOIN, SUM',
    `CREATE TABLE videos (${masterSchema.videos}); CREATE TABLE channels (${masterSchema.channels});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V206','C102','Advanced SQL Queries','2024-10-15','hd',1800,'public',true,false,true,'processed','none',120000,10200,230,false)", channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340)" },
    ['channel_name', 'total_likes'],
    [['Alpha Tech', 30500], ['Data With Mira', 19100]]
  ),

  p(37, 'Videos Belonging to Indian Channels', 'Display all videos uploaded by channels based in India.',
    ['videos', 'channels'], "Use JOIN + WHERE country = 'IN'.",
    "SELECT v.title, c.channel_name FROM videos v JOIN channels c ON v.channel_id = c.channel_id WHERE c.country = 'IN';",
    'Filter after joining to narrow results to specific countries.',
    'JOIN, WHERE',
    `CREATE TABLE videos (${masterSchema.videos}); CREATE TABLE channels (${masterSchema.channels});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V203','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'public',true,false,true,'processed','none',67000,5400,89,false)", channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89)" },
    ['title', 'channel_name'],
    [['SQL Masterclass Part 1','Data With Mira']]
  ),

  p(38, 'Top 5 Channels by Total Comments', 'Find the top 5 channels with the highest total comment count across all videos.',
    ['videos', 'channels'], 'Use JOIN + GROUP BY + SUM(comment_count) + ORDER BY DESC + LIMIT 5.',
    "SELECT c.channel_name, SUM(v.comment_count) AS total_comments FROM videos v JOIN channels c ON v.channel_id = c.channel_id GROUP BY c.channel_name ORDER BY total_comments DESC LIMIT 5;",
    'Aggregate across joined tables to find top performers.',
    'JOIN, SUM, LIMIT',
    `CREATE TABLE videos (${masterSchema.videos}); CREATE TABLE channels (${masterSchema.channels});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V206','C102','Advanced SQL Queries','2024-10-15','hd',1800,'public',true,false,true,'processed','none',120000,10200,230,false),('V204','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false),('V205','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'public',true,false,true,'processed','none',67000,5400,89,false)", channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89),('C104','CodeCraft',3200000,150000000,'US',true,'en','2014-06-01',560)" },
    ['channel_name', 'total_comments'],
    [['CodeCraft', 890], ['Alpha Tech', 860], ['Data With Mira', 386], ['SQL Zone', 89]]
  ),

  p(39, 'Videos from Channels with More Than 1 Million Subscribers', 'Display all videos from channels that have over 1 million subscribers.',
    ['videos', 'channels'], 'Use JOIN + WHERE subscriber_count > 1000000.',
    "SELECT v.title, c.channel_name, c.subscriber_count FROM videos v JOIN channels c ON v.channel_id = c.channel_id WHERE c.subscriber_count > 1000000;",
    'Filter on joined table columns to narrow results by channel attributes.',
    'JOIN, WHERE',
    `CREATE TABLE videos (${masterSchema.videos}); CREATE TABLE channels (${masterSchema.channels});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V203','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'public',true,false,true,'processed','none',67000,5400,89,false)", channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89)" },
    ['title', 'channel_name', 'subscriber_count'],
    [['Getting Started with Python','Alpha Tech',2500000],['SQL Masterclass Part 1','Data With Mira',1800000]]
  ),

  p(40, 'Channels with No Videos in the Dataset', 'Find channels that have no videos recorded in the videos table.',
    ['videos', 'channels'], 'Use LEFT JOIN + WHERE v.video_id IS NULL.',
    "SELECT c.channel_name FROM channels c LEFT JOIN videos v ON c.channel_id = v.channel_id WHERE v.video_id IS NULL;",
    'LEFT JOIN keeps all left-side rows. Filtering for NULL finds non-matching rows.',
    'LEFT JOIN',
    `CREATE TABLE videos (${masterSchema.videos}); CREATE TABLE channels (${masterSchema.channels});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false)", channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89)" },
    ['channel_name'],
    [['SQL Zone']]
  ),

  p(41, 'Categorize Channels by Subscriber Size', 'Use CASE WHEN to categorize channels as Small (<1M), Medium (1-2M), or Large (>2M).',
    ['channels'], 'Use CASE WHEN with subscriber_count ranges.',
    "SELECT channel_name, subscriber_count, CASE WHEN subscriber_count < 1000000 THEN 'Small' WHEN subscriber_count <= 2000000 THEN 'Medium' ELSE 'Large' END AS size_category FROM channels;",
    'CASE WHEN creates conditional columns. First matching condition wins.',
    'CASE WHEN',
    `CREATE TABLE channels (${masterSchema.channels});`,
    { channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89),('C104','CodeCraft',3200000,150000000,'US',true,'en','2014-06-01',560),('C105','Analytics Hub',500000,18000000,'IN',false,'hi','2020-11-15',45)" },
    ['channel_name', 'subscriber_count', 'size_category'],
    [['Alpha Tech',2500000,'Large'],['Data With Mira',1800000,'Medium'],['SQL Zone',950000,'Small'],['CodeCraft',3200000,'Large'],['Analytics Hub',500000,'Small']]
  ),

  p(42, 'Videos with Above-Average Views', 'Find all videos that have more views than the average across all videos.',
    ['videos'], 'Use a subquery with AVG in WHERE clause.',
    "SELECT video_id, title, views FROM videos WHERE views > (SELECT AVG(views) FROM videos);",
    'A subquery in WHERE runs first and returns a value used in the main query.',
    'Subquery',
    `CREATE TABLE videos (${masterSchema.videos});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V204','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'public',true,false,true,'processed','none',67000,5400,89,false),('V205','C104','Machine Learning Basics','2024-11-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false)" },
    ['video_id', 'title', 'views'],
    [['V203','Data Science 101',230000],['V205','Machine Learning Basics',450000]]
  ),

  p(43, 'Channels with Above-Average Channel Video Views', 'Find channels whose total video views exceed the average across all channels.',
    ['videos', 'channels'], 'Use GROUP BY + HAVING with subquery.',
    "SELECT c.channel_name, SUM(v.views) AS total_views FROM videos v JOIN channels c ON v.channel_id = c.channel_id GROUP BY c.channel_name HAVING total_views > (SELECT AVG(total) FROM (SELECT SUM(views) AS total FROM videos GROUP BY channel_id));",
    'HAVING filters groups using aggregated values, including results from subqueries.',
    'GROUP BY, HAVING, Subquery',
    `CREATE TABLE videos (${masterSchema.videos}); CREATE TABLE channels (${masterSchema.channels});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V204','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'public',true,false,true,'processed','none',67000,5400,89,false)", channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89)" },
    ['channel_name', 'total_views'],
    [['Alpha Tech', 380000]]
  ),

  p(44, 'Most Viewed Video per Channel', 'For each channel, find the video with the highest view count.',
    ['videos', 'channels'], 'Use a correlated subquery to find the max views per channel.',
    "SELECT c.channel_name, v.title, v.views FROM videos v JOIN channels c ON v.channel_id = c.channel_id WHERE v.views = (SELECT MAX(v2.views) FROM videos v2 WHERE v2.channel_id = v.channel_id);",
    'A correlated subquery references the outer query and runs for each row.',
    'Correlated Subquery',
    `CREATE TABLE videos (${masterSchema.videos}); CREATE TABLE channels (${masterSchema.channels});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false)", channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340)" },
    ['channel_name', 'title', 'views'],
    [['Alpha Tech','Data Science 101',230000],['Data With Mira','SQL Masterclass Part 1',89000]]
  ),

  p(45, 'Channels Where Likes Exceed Comments', 'Find channels where the total likes across all videos exceed total comments.',
    ['videos', 'channels'], 'Use GROUP BY + HAVING SUM(likes) > SUM(comment_count).',
    "SELECT c.channel_name, SUM(v.likes) AS total_likes, SUM(v.comment_count) AS total_comments FROM videos v JOIN channels c ON v.channel_id = c.channel_id GROUP BY c.channel_name HAVING total_likes > total_comments;",
    'HAVING can compare two aggregate expressions within each group.',
    'GROUP BY, HAVING',
    `CREATE TABLE videos (${masterSchema.videos}); CREATE TABLE channels (${masterSchema.channels});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V206','C102','Advanced SQL Queries','2024-10-15','hd',1800,'public',true,false,true,'processed','none',120000,10200,230,false)", channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340)" },
    ['channel_name', 'total_likes', 'total_comments'],
    [['Alpha Tech', 30500, 860], ['Data With Mira', 19100, 386]]
  ),

  p(46, 'Rank Channels by Total Video Views', 'Rank channels based on total video views using a window function.',
    ['videos', 'channels'], 'Use CTE with SUM + RANK() window function.',
    "WITH channel_views AS (SELECT c.channel_name, SUM(v.views) AS total_views FROM videos v JOIN channels c ON v.channel_id = c.channel_id GROUP BY c.channel_name) SELECT channel_name, total_views, RANK() OVER (ORDER BY total_views DESC) AS rank FROM channel_views;",
    'CTEs (WITH) create temporary named result sets. RANK() assigns a rank to each row.',
    'CTE, Window Function',
    `CREATE TABLE videos (${masterSchema.videos}); CREATE TABLE channels (${masterSchema.channels});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V204','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'public',true,false,true,'processed','none',67000,5400,89,false)", channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340),('C103','SQL Zone',950000,40000000,'UK',false,'en','2019-01-20',89)" },
    ['channel_name', 'total_views', 'rank'],
    [['Alpha Tech',380000,1],['Data With Mira',89000,2],['SQL Zone',67000,3]]
  ),

  p(47, 'Top 3 Most Viewed Videos Within Each Channel', 'For each channel, find the 3 most viewed videos.',
    ['videos', 'channels'], 'Use CTE with ROW_NUMBER() partitioned by channel.',
    "WITH ranked_videos AS (SELECT c.channel_name, v.title, v.views, ROW_NUMBER() OVER (PARTITION BY v.channel_id ORDER BY v.views DESC) AS rn FROM videos v JOIN channels c ON v.channel_id = c.channel_id) SELECT channel_name, title, views FROM ranked_videos WHERE rn <= 3;",
    'ROW_NUMBER() with PARTITION BY resets the count for each channel.',
    'CTE, ROW_NUMBER',
    `CREATE TABLE videos (${masterSchema.videos}); CREATE TABLE channels (${masterSchema.channels});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V209','C101','CSS Flexbox Guide','2024-11-01','hd',1500,'public',true,false,false,'processed','none',98000,7600,180,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V206','C102','Advanced SQL Queries','2024-10-15','hd',1800,'public',true,false,true,'processed','none',120000,10200,230,false),('V211','C102','Database Normalization','2024-10-25','hd',2100,'public',true,false,true,'processed','none',76000,6100,134,false)", channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340)" },
    ['channel_name', 'title', 'views'],
    [['Alpha Tech','Data Science 101',230000],['Alpha Tech','Getting Started with Python',150000],['Alpha Tech','CSS Flexbox Guide',98000],['Data With Mira','Advanced SQL Queries',120000],['Data With Mira','SQL Masterclass Part 1',89000],['Data With Mira','Database Normalization',76000]]
  ),

  p(48, 'Monthly Upload Trend by Channel', 'Show how many videos each channel uploaded per month.',
    ['videos', 'channels'], 'Use strftime + GROUP BY on channel and month.',
    "SELECT c.channel_name, strftime('%Y-%m', v.publish_date) AS month, COUNT(*) AS video_count FROM videos v JOIN channels c ON v.channel_id = c.channel_id GROUP BY c.channel_name, month ORDER BY c.channel_name, month;",
    'Extract year-month from dates to group by monthly periods.',
    'Date Functions, GROUP BY',
    `CREATE TABLE videos (${masterSchema.videos}); CREATE TABLE channels (${masterSchema.channels});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V209','C101','CSS Flexbox Guide','2024-11-01','hd',1500,'public',true,false,false,'processed','none',98000,7600,180,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V206','C102','Advanced SQL Queries','2024-10-15','hd',1800,'public',true,false,true,'processed','none',120000,10200,230,false)", channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340)" },
    ['channel_name', 'month', 'video_count'],
    [['Alpha Tech','2024-11',2],['Alpha Tech','2024-12',1],['Data With Mira','2024-10',1],['Data With Mira','2024-11',1]]
  ),

  p(49, 'Month with Highest Upload Volume', 'Find which month had the highest total video uploads across all channels.',
    ['videos'], 'Use CTE with GROUP BY + ORDER BY + LIMIT 1.',
    "WITH monthly_counts AS (SELECT strftime('%Y-%m', publish_date) AS month, COUNT(*) AS upload_count FROM videos GROUP BY month) SELECT month, upload_count FROM monthly_counts ORDER BY upload_count DESC LIMIT 1;",
    'CTEs make complex queries readable. Combine with aggregation for clear insights.',
    'CTE, Aggregation',
    `CREATE TABLE videos (${masterSchema.videos});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V204','C103','Learn Pandas in 1 Hour','2024-11-20','hd',3600,'public',true,false,true,'processed','none',67000,5400,89,false),('V205','C104','Machine Learning Basics','2024-10-18','hd',2700,'public',true,false,true,'processed','none',450000,34000,890,false)" },
    ['month', 'upload_count'],
    [['2024-11', 3]]
  ),

  p(50, 'Latest Video Performing Above Channel Average', 'Find the most recent video from each channel that has above-average views for that channel.',
    ['videos', 'channels'], 'Use CTE + Window Function + JOIN — find latest video per channel that exceeds channel avg.',
    "WITH channel_avg AS (SELECT channel_id, AVG(views) AS avg_views FROM videos GROUP BY channel_id), ranked_videos AS (SELECT v.channel_id, v.title, v.views, v.publish_date, ROW_NUMBER() OVER (PARTITION BY v.channel_id ORDER BY v.publish_date DESC) AS rn FROM videos v JOIN channel_avg ca ON v.channel_id = ca.channel_id WHERE v.views > ca.avg_views) SELECT c.channel_name, rv.title, rv.views, rv.publish_date FROM ranked_videos rv JOIN channels c ON rv.channel_id = c.channel_id WHERE rv.rn = 1;",
    'Combine CTEs, window functions, and JOINs for advanced analytics.',
    'CTE, Window Function, JOIN',
    `CREATE TABLE videos (${masterSchema.videos}); CREATE TABLE channels (${masterSchema.channels});`,
    { videos: "INSERT INTO videos (video_id, channel_id, title, publish_date, definition, duration, privacy_status, embeddable, made_for_kids, caption, upload_status, live_broadcast_content, views, likes, comment_count, comments_disabled) VALUES ('V201','C101','Getting Started with Python','2024-12-01','hd',1200,'public',true,false,true,'processed','none',150000,12000,340,false),('V203','C101','Data Science 101','2024-11-25','hd',1800,'public',true,false,false,'processed','none',230000,18500,520,false),('V209','C101','CSS Flexbox Guide','2024-11-01','hd',1500,'public',true,false,false,'processed','none',98000,7600,180,false),('V202','C102','SQL Masterclass Part 1','2024-11-28','hd',2400,'public',true,false,true,'processed','none',89000,8900,156,false),('V206','C102','Advanced SQL Queries','2024-10-15','hd',1800,'public',true,false,true,'processed','none',120000,10200,230,false)", channels: "INSERT INTO channels (channel_id, channel_name, subscriber_count, view_count, country, subscriber_hidden, default_language, published_at, video_count) VALUES ('C101','Alpha Tech',2500000,92000000,'US',false,'en','2015-03-12',120),('C102','Data With Mira',1800000,71000000,'IN',false,'en','2017-08-05',340)" },
    ['channel_name', 'title', 'views', 'publish_date'],
    [['Alpha Tech','Data Science 101',230000,'2024-11-25'],['Data With Mira','Advanced SQL Queries',120000,'2024-10-15']]
  ),
];

let data = { schema: {}, problems };
for (let [name, def] of Object.entries(masterSchema)) {
  data.schema[name] = { columns: def.split(', ').map(c => { let [n, ...t] = c.split(' '); return { name: n, type: t.join(' ') }; }) };
}
// Normalize expected output: convert JS booleans to 0/1 (SQLite returns ints for booleans)
data.problems.forEach(function(p) {
  if (p.expected_output && p.expected_output.rows) {
    p.expected_output.rows = p.expected_output.rows.map(function(row) {
      return row.map(function(v) { return (v === true) ? 1 : (v === false) ? 0 : v; });
    });
  }
});
fs.writeFileSync('sql-project/problems.json', JSON.stringify(data, null, 2));
console.log('Generated problems.json with ' + problems.length + ' problems');
