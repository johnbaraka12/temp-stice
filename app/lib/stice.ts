export type SticeMainTheme = {
  id?: number;
  title: string;
  subtitle?: string;
  description?: string;
  published: boolean;
  sortOrder: number;
};

export type SticeVenue = {
  id?: number;
  title: string;
  venueName: string;
  address?: string;
  city?: string;
  country?: string;
  description?: string;
  imageUrl?: string;
  mapUrl?: string;
  latitude?: number;
  longitude?: number;
  published: boolean;
  sortOrder: number;
};

export type SticeThematicArea = {
  id?: number;
  title: string;
  summary?: string;
  description?: string;
  icon?: string;
  published: boolean;
  sortOrder: number;
};

export type SticeSponsorship = {
  id?: number;
  name: string;
  headline?: string;
  description?: string;
  amount?: number;
  currency?: string;
  benefits: string[];
  contactEmail?: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

export type SticeCall = {
  id?: number;
  title: string;
  subtitle?: string;
  description?: string;
  instructions?: string;
  submissionUrl?: string;
  guidelineDocumentUrl?: string;
  contactEmail?: string;
  opensAt?: string;
  closesAt?: string;
  published: boolean;
  sortOrder: number;
  firstName?: string;
  lastName?: string;
  gender?: string;
  phone?: string;
  email?: string;
  nationality?: string;
  city?: string;
  jobTitle?: string;
  departmentUnit?: string;
  organizationName?: string;
  organizationType?: string;
  coreBusiness?: string;
  operationalScope?: string;
  submissionType?: string;
  preferredPresentationMode?: string;
  sectorCategory?: string;
  theme?: string;
  submissionStatus?: string;
  submittedAt?: string;
  abstractFileName?: string;
};

export type SticeContent = {
  callForSubmission: SticeCall | null;
  venue: SticeVenue | null;
  mainTheme: SticeMainTheme | null;
  thematicAreas: SticeThematicArea[];
  sponsorshipPackages: SticeSponsorship[];
};

export const API_BASE = (process.env.NEXT_PUBLIC_MARATHOND_API_URL || "http://localhost:8080").replace(/\/$/, "");

export const fallbackContent: SticeContent = {
  callForSubmission: {
    title: "Call for Contributions",
    subtitle: "Present your evidence, innovation or implementation experience at COSTECH@40.",
    description:
      "We welcome policy briefs, strategic papers, evidence syntheses, innovation showcases, technology demonstrations and applied research contributions.",
    instructions: "Abstracts should not exceed 300 words and must include 3–5 relevant keywords.",
    contactEmail: "costech40@costech.or.tz",
    opensAt: "2026-07-01T00:00:00",
    closesAt: "2026-08-15T23:59:59",
    published: true,
    sortOrder: 0,
  },
  venue: {
    title: "Where ideas meet action",
    venueName: "Julius Nyerere International Convention Centre (JNICC)",
    address: "Shaaban Robert Street",
    city: "Dar es Salaam",
    country: "United Republic of Tanzania",
    description: "A landmark national venue in the heart of Dar es Salaam, bringing Tanzania's STI community together.",
    imageUrl: "/images/stice-venue.jpg",
    mapUrl: "https://maps.google.com/?q=JNICC+Dar+es+Salaam",
    published: true,
    sortOrder: 0,
  },
  mainTheme: {
    title: "From Legacy to Future",
    subtitle: "COSTECH@40 and the Road Towards Vision 2050",
    description:
      "Four decades of advancing science, technology and innovation—now focused on turning knowledge into solutions for Tanzania's next chapter.",
    published: true,
    sortOrder: 0,
  },
  thematicAreas: [
    {
      title: "Science, Technology, Innovation & Digital Transformation",
      summary: "AI, data, cybersecurity, infrastructure, research and innovation financing.",
      description: "Strengthening industrial competitiveness, public services, entrepreneurship and inclusive economic transformation at scale.",
      icon: "01",
      published: true,
      sortOrder: 1,
    },
    {
      title: "Industrialization, Infrastructure & Competitive Economy",
      summary: "Manufacturing, energy, transport, value addition, SMEs and exports.",
      description: "Advancing industrial transformation through commercialization, technological upgrading and resilient enterprises.",
      icon: "02",
      published: true,
      sortOrder: 2,
    },
    {
      title: "Human Capital, Health & Knowledge Society",
      summary: "STEM, future skills, biomedical innovation, digital health and inclusion.",
      description: "Building the people and institutions required for long-term national competitiveness.",
      icon: "03",
      published: true,
      sortOrder: 3,
    },
    {
      title: "Climate Resilience, Sustainable Agriculture & Green Transformation",
      summary: "Food systems, biodiversity, renewable energy, blue economy and climate finance.",
      description: "Science-based solutions for resilient livelihoods, ecosystems and resource productivity.",
      icon: "04",
      published: true,
      sortOrder: 4,
    },
  ],
  sponsorshipPackages: [
    {
      name: "Tanzanite",
      headline: "Main Summit Partner",
      description: "Lead the national conversation and receive the summit's highest level of visibility.",
      amount: 100000000,
      currency: "TZS",
      benefits: ["Main sponsor recognition", "6m × 3m exhibition booth", "10 summit delegate passes", "High-table representation"],
      contactEmail: "costech40@costech.or.tz",
      featured: true,
      published: true,
      sortOrder: 1,
    },
    {
      name: "Diamond",
      headline: "STI Marathon & Legacy Book",
      description: "Champion the STI Marathon and COSTECH@40 legacy publication.",
      amount: 75000000,
      currency: "TZS",
      benefits: ["Lead marathon sponsor", "25 STIthon delegate passes", "6m × 3m exhibition booth", "Book and event branding"],
      contactEmail: "costech40@costech.or.tz",
      featured: false,
      published: true,
      sortOrder: 2,
    },
    {
      name: "Platinum",
      headline: "Knowledge & Inclusion Partner",
      description: "Support women in science, speakers, moderators and policy engagement.",
      amount: 50000000,
      currency: "TZS",
      benefits: ["Women in science recognition", "Summit address opportunity", "6m × 3m exhibition booth", "Five delegate passes"],
      contactEmail: "costech40@costech.or.tz",
      featured: false,
      published: true,
      sortOrder: 3,
    },
  ],
};

export async function getPublicContent(signal?: AbortSignal): Promise<SticeContent> {
  const response = await fetch(`${API_BASE}/api/stice/content`, { signal, cache: "no-store" });
  if (!response.ok) throw new Error(`Unable to load STICE content (${response.status})`);
  const data = (await response.json()) as Partial<SticeContent>;
  return {
    callForSubmission: data.callForSubmission || fallbackContent.callForSubmission,
    venue: data.venue || fallbackContent.venue,
    mainTheme: data.mainTheme || fallbackContent.mainTheme,
    thematicAreas: data.thematicAreas?.length ? data.thematicAreas : fallbackContent.thematicAreas,
    sponsorshipPackages: data.sponsorshipPackages?.length ? data.sponsorshipPackages : fallbackContent.sponsorshipPackages,
  };
}

export async function apiRequest<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || `Request failed (${response.status})`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
