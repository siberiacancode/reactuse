import { blogSource } from '@docs/lib/source';
import { Feed } from 'feed';
import process from 'node:process';

export const getRSS = () => {
  const feed = new Feed({
    title: 'reactuse blog',
    id: `${process.env.NEXT_PUBLIC_APP_URL}/blog`,
    link: `${process.env.NEXT_PUBLIC_APP_URL}/blog`,
    description: 'News, guides and updates about reactuse.',
    language: 'en',
    favicon: `${process.env.NEXT_PUBLIC_APP_URL}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, SIBERIA CAN CODE`
  });

  const posts = [...blogSource.getPages()].sort(
    (a, b) => Number(a.data.date) - Number(b.data.date)
  );

  for (const page of posts) {
    feed.addItem({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      link: `${process.env.NEXT_PUBLIC_APP_URL}${page.url}`,
      date: new Date(page.data.date)
    });
  }

  return feed.rss2();
};
