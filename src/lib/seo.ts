import type { Article, Attraction, Hotel, Restaurant } from "@/types/content";
import { BRAND_NAME } from "@/lib/brand";
import { absoluteUrl } from "@/lib/utils";

export function breadcrumbJsonLd(items: Array<{ name: string; href: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href)
    }))
  };
}

export function articleJsonLd(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.og_image || article.cover_image,
    datePublished: article.published_at,
    dateModified: article.published_at,
    author: {
      "@type": "Organization",
      name: BRAND_NAME
    },
    publisher: {
      "@type": "Organization",
      name: BRAND_NAME
    },
    mainEntityOfPage: absoluteUrl(`/blog/${article.slug}`)
  };
}

export function faqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

export function touristAttractionJsonLd(attraction: Attraction) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: attraction.name,
    alternateName: attraction.english_name,
    description: attraction.description,
    image: attraction.cover_image,
    address: attraction.address,
    geo: {
      "@type": "GeoCoordinates",
      latitude: attraction.latitude,
      longitude: attraction.longitude
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: attraction.rating,
      reviewCount: 120
    }
  };
}

export function localBusinessJsonLd(restaurant: Restaurant) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    description: restaurant.description,
    image: restaurant.cover_image,
    address: restaurant.address,
    telephone: restaurant.phone,
    servesCuisine: restaurant.cuisine_type,
    priceRange: `TWD ${restaurant.average_price}`,
    geo: {
      "@type": "GeoCoordinates",
      latitude: restaurant.latitude,
      longitude: restaurant.longitude
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: restaurant.rating,
      reviewCount: 80
    }
  };
}

export function hotelJsonLd(hotel: Hotel) {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: hotel.name,
    description: hotel.description,
    image: hotel.cover_image,
    address: hotel.address,
    starRating: {
      "@type": "Rating",
      ratingValue: hotel.star_rating
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: hotel.latitude,
      longitude: hotel.longitude
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: hotel.rating,
      reviewCount: 150
    }
  };
}
