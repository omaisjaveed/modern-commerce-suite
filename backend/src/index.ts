// 1. Load environment variables at the ABSOLUTE BEGINNING
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

// 2. Now import other packages
import express from 'express';
import cors from 'cors';

// 3. Import routes
import authRoutes from './routes/authRoutes';
import pageRoutes from './routes/pageRoutes';
import inquiryRoutes from './routes/inquiryRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import blogRoutes from './routes/blogRoutes';
import mediaRoutes from './routes/mediaRoutes';
import orderRoutes from './routes/orderRoutes';
import settingRoutes from './routes/settingRoutes';
import brandRoutes from './routes/brandRoutes';
import reviewRoutes from './routes/reviewRoutes';
import productReviewRoutes from './routes/productReviewRoutes';
import faqRoutes from './routes/faqRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// STATIC FILES (BEFORE PREFIX STRIP)
// ==========================================
// Production structure: Root is where app.js is. uploads is in root.
const uploadsPath = path.join(process.cwd(), 'uploads');
console.log('App Root (CWD):', process.cwd());
console.log('Serving static files from:', uploadsPath);

app.use('/jewelry-api/uploads', express.static(uploadsPath));
app.use('/uploads', express.static(uploadsPath));
app.use((req, res, next) => {
  const prefixes = ['/jewelry-api'];
  for (const prefix of prefixes) {
    if (req.url.startsWith(prefix)) {
      req.url = req.url.substring(prefix.length) || '/';
      break;
    }
  }
  next();
});

// Routes
const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/pages', pageRoutes);
apiRouter.use('/inquiries', inquiryRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/blogs', blogRoutes);
apiRouter.use('/media', mediaRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/settings', settingRoutes);
apiRouter.use('/brands', brandRoutes);
apiRouter.use('/reviews', reviewRoutes);
apiRouter.use('/product-reviews', productReviewRoutes);
apiRouter.use('/faqs', faqRoutes);

app.use('/api', apiRouter);

// Basic route
app.get('/', (req, res) => {
  res.send('Jewelery CMS API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
