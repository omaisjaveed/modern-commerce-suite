import pool from './config/db';
import bcrypt from 'bcryptjs';

const seedReviews = async () => {
  try {
    const reviews = [
      {
        name: "Chealsea Austin",
        designation: "Models",
        content: "Ullamcorper diam laoreet eget eu ornare netus ad inceptos. Purus ullamcorper accumsan habitant nascetur fusce mi cubilia. Aptent dis lacinia pretium feugiat curabitur taciti volutpat ante platea nascetur.",
        avatar: "/src/assets/review-1.webp",
        status: "active"
      },
      {
        name: "John Doe",
        designation: "Designer",
        content: "Ullamcorper diam laoreet eget eu ornare netus ad inceptos. Purus ullamcorper accumsan habitant nascetur fusce mi cubilia. Aptent dis lacinia pretium feugiat curabitur taciti volutpat ante platea nascetur.",
        avatar: "/src/assets/review-2.webp",
        status: "active"
      },
      {
        name: "Emily Clark",
        designation: "CEO",
        content: "Ullamcorper diam laoreet eget eu ornare netus ad inceptos. Purus ullamcorper accumsan habitant nascetur fusce mi cubilia. Aptent dis lacinia pretium feugiat curabitur taciti volutpat ante platea nascetur.",
        avatar: "/src/assets/review-3.webp",
        status: "active"
      }
    ];

    for (const review of reviews) {
      await pool.query(
        'INSERT INTO reviews (name, designation, content, avatar, status) VALUES (?, ?, ?, ?, ?)',
        [review.name, review.designation, review.content, review.avatar, review.status]
      );
    }

    console.log('Reviews seeded successfully');
  } catch (error) {
    console.error('Error seeding reviews:', error);
  }
};

seedReviews();
