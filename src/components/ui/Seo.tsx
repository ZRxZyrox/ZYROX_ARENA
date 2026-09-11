import { Helmet } from "react-helmet-async";

interface Props {
  title: string;
  description: string;
  image?: string;
  noindex?: boolean;
}

/**
 * Every page-level component should render this once with page-specific
 * copy — search engines and social previews (OG/Twitter cards) need
 * distinct title/description per tournament and per game category to be
 * worth anything for SEO; a single static <title> in index.html would
 * mean every tournament page looks identical to Google.
 */
export default function Seo({ title, description, image, noindex }: Props) {
  const fullTitle = `${title} — ZYROX ARENA`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
}
