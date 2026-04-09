import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const defaultSeo = {
  title: "Carrefour Kenya Careers | Job Opportunities",
  description:
    "Join Carrefour Kenya. Explore career opportunities with competitive salaries, medical benefits, and growth potential across all departments.",
};

const seoForPath = (pathname: string) => {
  if (pathname === "/") return defaultSeo;
  if (pathname === "/contact") {
    return {
      title: "Contact | Carrefour Kenya Careers",
      description:
        "Contact Carrefour Kenya Careers for questions about job opportunities, applications, and support.",
    };
  }
  if (pathname === "/privacy") {
    return {
      title: "Privacy Policy | Carrefour Kenya Careers",
      description:
        "Read our privacy policy to understand how we collect, use, and protect your personal information.",
    };
  }
  if (pathname === "/terms") {
    return {
      title: "Terms of Service | Carrefour Kenya Careers",
      description:
        "Review the terms of service for using this website and applying for job opportunities.",
    };
  }
  if (pathname === "/cookies") {
    return {
      title: "Cookie Policy | Carrefour Kenya Careers",
      description:
        "Learn how we use cookies to improve site performance, analytics, and your browsing experience.",
    };
  }
  if (pathname === "/faq") {
    return {
      title: "FAQ - Frequently Asked Questions | Carrefour Kenya Careers",
      description:
        "Find answers to common questions about Carrefour Kenya job applications, requirements, salaries, benefits, and career opportunities. Get all the information you need before applying.",
    };
  }
  if (pathname === "/blog") {
    return {
      title: "Carrefour Kenya Career Blog | Job Search Tips & Retail News",
      description:
        "The official Carrefour Kenya Career Blog. Get expert job search tips, interview preparation guides, retail industry news, and salary insights for the Kenyan job market.",
    };
  }
  if (pathname.startsWith("/jobs/location/")) {
    const locationSlug = pathname.split("/").pop();
    const locationName = locationSlug ? locationSlug.charAt(0).toUpperCase() + locationSlug.slice(1) : "Kenya";
    return {
      title: `Carrefour Kenya Jobs in ${locationName} | ${locationName} Vacancies`,
      description:
        `Find all open Carrefour Kenya job opportunities in ${locationName}. Apply for retail, logistics, and management vacancies in ${locationName} today.`,
    };
  }
  return defaultSeo;
};

const isNoindexPath = (pathname: string) => {
  if (pathname === "/profile" || pathname.startsWith("/profile/")) return true;
  if (pathname === "/survey" || pathname.startsWith("/survey/")) return true;
  return false;
};

const canonicalizePathname = (pathname: string) => {
  if (!pathname) return "/";
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
};

const ensureMeta = (name: string) => {
  let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }
  return meta;
};

const ensureMetaProperty = (property: string) => {
  let meta = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }
  return meta;
};

const canonicalOrigin = () => {
  const preferred = "https://www.careeropportunitiesportal.site";
  const host = window.location.hostname.toLowerCase();
  if (host.endsWith("careeropportunitiesportal.site")) return preferred;
  return window.location.origin;
};

const ensureLinkRel = (rel: string) => {
  let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }
  return link;
};

const SeoManager = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = canonicalizePathname(location.pathname);
    const canonicalHref = `${canonicalOrigin()}${pathname}`;

    const seo = seoForPath(pathname);
    document.title = seo.title;
    ensureMeta("description").setAttribute("content", seo.description);

    ensureMetaProperty("og:title").setAttribute("content", seo.title);
    ensureMetaProperty("og:description").setAttribute("content", seo.description);
    ensureMetaProperty("og:url").setAttribute("content", canonicalHref);

    const canonical = ensureLinkRel("canonical");
    canonical.setAttribute("href", canonicalHref);

    if (isNoindexPath(pathname)) {
      const robots = ensureMeta("robots");
      robots.setAttribute("content", "noindex, nofollow");
    } else {
      const robots = document.querySelector<HTMLMetaElement>("meta[name=\"robots\"]");
      if (robots && robots.getAttribute("content")?.includes("noindex")) {
        robots.remove();
      }
    }
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const id = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (!id) return;

    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.pathname, location.hash]);

  return null;
};

export default SeoManager;
