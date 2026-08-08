import { blogSource } from '@docs/lib/source';
import { Feed } from 'feed';
import process from 'node:process';

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://reactuse.org').replace(/\/$/, '');

export const getRSS = () => {
  const feed = new Feed({
    title: 'reactuse blog',
    id: `${baseUrl}/blog`,
    link: `${baseUrl}/blog`,
    description: 'News, guides and updates about reactuse.',
    language: 'en',
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, SIBERIA CAN CODE`
  });

  const posts = [...blogSource.getPages()].sort((a, b) => {
    const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
    const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
    return dateB - dateA;
  });

  for (const page of posts) {
    feed.addItem({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      link: `${baseUrl}${page.url}`,
      date: page.data.date ? new Date(page.data.date) : new Date(),
      author: page.data.author ? [{ name: page.data.author }] : undefined
    });
  }

  return feed.rss2();
};
