import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Page {
  id?: number;
  title: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  status: 'draft' | 'published';
}

export interface PageSection {
  id?: number;
  page_id: number;
  section_name: string;
  content: any;
  sort_order: number;
}

export const getPageBySlug = async (slug: string): Promise<any | null> => {
  const [pages] = await pool.query<Page[] & RowDataPacket[]>('SELECT * FROM pages WHERE slug = ?', [slug]);
  if (pages.length === 0) return null;

  const page = pages[0] as Page;
  const [sections] = await pool.query<PageSection[] & RowDataPacket[]>('SELECT * FROM page_sections WHERE page_id = ? ORDER BY sort_order ASC', [page.id]);
  
  return {
    ...page,
    sections: (sections as PageSection[]).reduce((acc: any, section) => {
      acc[section.section_name] = section.content;
      return acc;
    }, {})
  };
};

export const createPage = async (pageData: Partial<Page>): Promise<number> => {
  const { title, slug, meta_title, meta_description, og_image, status } = pageData;
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO pages (title, slug, meta_title, meta_description, og_image, status) VALUES (?, ?, ?, ?, ?, ?)',
    [title, slug, meta_title, meta_description, og_image, status || 'published']
  );
  return result.insertId;
};

export const updatePageSection = async (pageId: number, sectionName: string, content: any, sortOrder: number = 0): Promise<void> => {
  // Check if section exists
  const [existing] = await pool.query<PageSection[] & RowDataPacket[]>('SELECT id FROM page_sections WHERE page_id = ? AND section_name = ?', [pageId, sectionName]);
  
  if (existing.length > 0) {
    await pool.query('UPDATE page_sections SET content = ?, sort_order = ? WHERE id = ?', [JSON.stringify(content), sortOrder, existing[0].id]);
  } else {
    await pool.query('INSERT INTO page_sections (page_id, section_name, content, sort_order) VALUES (?, ?, ?, ?)', [pageId, sectionName, JSON.stringify(content), sortOrder]);
  }
};
