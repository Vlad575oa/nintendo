"use client";

export const HomeSchema = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Nintendo Shop",
    "url": "https://nintendo.shop",
    "logo": "https://nintendo.shop/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+7-495-225-99-22",
      "contactType": "customer service",
      "areaServed": "RU",
      "availableLanguage": "Russian"
    },
    "sameAs": [
      "https://t.me/nintendoshop",
      "https://vk.com/nintendoshop"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Nintendo Shop",
    "url": "https://nintendo.shop",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://nintendo.shop/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
};
