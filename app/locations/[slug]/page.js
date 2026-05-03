import { notFound } from "next/navigation";
import SuburbRichPage from "../../components/SuburbRichPage";
import { suburbs, getSuburb, SITE_URL } from "../../data/seoLocations";

export function generateStaticParams() {
  return suburbs.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const suburb = getSuburb(slug);
  if (!suburb) return {};
  const url = `${SITE_URL}/locations/${suburb.slug}`;
  return {
    title: { absolute: suburb.title },
    description: suburb.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: "PureGlim",
      title: suburb.title,
      description: suburb.description,
      locale: "en_AU",
    },
    twitter: {
      card: "summary_large_image",
      title: suburb.title,
      description: suburb.description,
    },
  };
}

export default async function SuburbPage({ params }) {
  const { slug } = await params;
  const suburb = getSuburb(slug);
  if (!suburb) notFound();
  return <SuburbRichPage suburb={suburb} />;
}
