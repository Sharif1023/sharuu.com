import Markdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';

export default function CmsPageView() {
  const { slug } = useParams();
  const { pages } = useStore();
  const page = pages.find(item => item.slug === slug && item.status === 'published');
  if (!page) return <main className="page container"><div className="empty-state"><h1>Page not found</h1></div></main>;
  return <main className="page container content-page"><span className="eyebrow">Information</span><h1>{page.title}</h1><div className="markdown"><Markdown>{page.content}</Markdown></div></main>;
}
