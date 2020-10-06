import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT || 3000,
  DEFAULT_PROFILE_PIC:
    'https://palpa-files.s3-ap-southeast-2.amazonaws.com/defaults/default-profile-pic.jpg',
  DEFAULT_COVER_IMG:
    'https://palpa-files.s3-ap-southeast-2.amazonaws.com/defaults/default-cover-image.png',
  DEFAULT_PROJECT_THUMBNAIL: 'https://palpa-files.s3-ap-southeast-2.amazonaws.com/defaults/project-default-thumbnail.jpg'
};
