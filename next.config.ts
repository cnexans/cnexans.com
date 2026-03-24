import { getBlogPosts } from "@/content/utils";
import { locales } from "@/i18n/routing";
import createMDX from '@next/mdx';
import type { NextConfig } from "next";
import createNextIntl from "next-intl/plugin";
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

function generateSocialRedirects() {
  const subdomainMapping = [
    { subdomain: "meet", destination: "https://calendly.com/nexanscarlos/30min" },
    { subdomain: "github", destination: "https://github.com/cnexans" },
    { subdomain: "linkedin", destination: "https://www.linkedin.com/in/cdgn-cv/" },
    { subdomain: "x", destination: "https://x.com/techycarlos" },
    { subdomain: "youtube", destination: "https://www.youtube.com/@CarlosNexans" },
  ]
  return subdomainMapping.flatMap(({ subdomain, destination }) => ([
    {
      source: "/",
      has: [
        {
          type: "host",
          value: `${subdomain}.carlosnexans.com`,
        },
      ],
      destination: destination,
      permanent: false,
    },
    {
      source: "/",
      has: [
        {
          type: "host",
          value: `${subdomain}.cnexans.com`,
        },
      ],
      destination: destination,
      permanent: false,
    }
  ]))
}

async function generateOldWebsiteRedirects() {
  const posts = await getBlogPosts();
  const prefixes = ['articles', 'articulos', 'tutoriales', 'tutorials'];

  const redirects = posts.flatMap(post => {
    const withoutLocale = prefixes.map(prefix => ({
      source: `/${prefix}/${post.metadata.slug}`,
      destination: `/${post.metadata.slug}`,
      permanent: true
    }));

    const withLocale = locales.flatMap(locale => withoutLocale.map(redirect => ({
      source: `/${locale}${redirect.source}`,
      destination: `/${locale}${redirect.destination}`,
      permanent: true
    })));

    return [...withLocale, ...withLocale];
  });

  const listingRedirects = [
    {
      source: '/es/articulos',
      destination: '/es/blog',
      permanent: true
    },
    {
      source: '/en/articles',
      destination: '/en/blog',
      permanent: true
    },
    {
      source: '/es/tutoriales',
      destination: '/es/blog',
      permanent: true
    },
    {
      source: '/en/tutorials',
      destination: '/en/blog',
      permanent: true
    }
  ]
  return [...redirects, ...listingRedirects];
}

const withNextIntl = createNextIntl();
const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm, [remarkFrontmatter], remarkMath],
    rehypePlugins: [rehypeKatex, [rehypeHighlight, { lineOptions: { split: true } }]],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'covers.openlibrary.org',
        port: '',
        pathname: '/b/**',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        port: '',
        pathname: '/image/**',
      },
    ],
  },

  rewrites: async () => {
    const posts = await getBlogPosts();
    const postRewrites = posts.flatMap((post) => [{
      source: `/es/${post.metadata.slug}`,
      destination: `/${post.locale}/blog/${post.folder}`,
    }, {
      source: `/en/${post.metadata.slug}`,
      destination: `/${post.locale}/blog/${post.folder}`,
    }]);

    return [...postRewrites];
  },
  redirects: async () => {
    const oldWebsiteRedirects = await generateOldWebsiteRedirects();
    const socialRedirects = generateSocialRedirects();
    return [
      ...oldWebsiteRedirects,
      ...socialRedirects,
    ];
  },
};

// Compose both withMDX and withNextIntl
export default withMDX(withNextIntl(nextConfig));
