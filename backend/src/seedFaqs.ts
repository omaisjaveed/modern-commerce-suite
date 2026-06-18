import pool from './config/db';

const seedFaqs = async () => {
  try {
    const faqs = [
      {
        question: "Morbi imperdiet habitant potenti ultrices ridiculus?",
        answer: "Feugiat cubilia at nec dictumst nulla malesuada. Vehicula ultricies lobortis ante nibh fermentum feugiat dapibus ullamcorper mi. Eu imperdiet augue viverra id congue euismod.",
        status: "active"
      },
      {
        question: "Pretium habitasse ac tempus?",
        answer: "Feugiat cubilia at nec dictumst nulla malesuada. Vehicula ultricies lobortis ante nibh fermentum feugiat dapibus ullamcorper mi. Eu imperdiet augue viverra id congue euismod.",
        status: "active"
      },
      {
        question: "Curae magnis non justo porttitor?",
        answer: "Feugiat cubilia at nec dictumst nulla malesuada. Vehicula ultricies lobortis ante nibh fermentum feugiat dapibus ullamcorper mi. Eu imperdiet augue viverra id congue euismod.",
        status: "active"
      },
      {
        question: "Molestie mollis sed fermentum penatibus vel?",
        answer: "Feugiat cubilia at nec dictumst nulla malesuada. Vehicula ultricies lobortis ante nibh fermentum feugiat dapibus ullamcorper mi. Eu imperdiet augue viverra id congue euismod.",
        status: "active"
      },
      {
        question: "Elit facilisi himenaeos consequat proin?",
        answer: "Feugiat cubilia at nec dictumst nulla malesuada. Vehicula ultricies lobortis ante nibh fermentum feugiat dapibus ullamcorper mi. Eu imperdiet augue viverra id congue euismod.",
        status: "active"
      }
    ];

    for (const faq of faqs) {
      await pool.query(
        'INSERT INTO faqs (question, answer, status) VALUES (?, ?, ?)',
        [faq.question, faq.answer, faq.status]
      );
    }

    console.log('FAQs seeded successfully');
  } catch (error) {
    console.error('Error seeding FAQs:', error);
  }
};

seedFaqs();
