import { useState } from "react";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Phone,
  Globe,
  Bookmark,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SchoolResult {
  id: string;
  name: string;
  type: string;
  rating: number;
  distance: string;
  description: string;
  website: string;
  phone: string;
  address: string;
  fees?: string;
  ofstedRating?: string;
}

interface ClassicSearchProps {
  mode: "chat" | "classic";
  onToggleMode: () => void;
}

const schoolTypes = ["All", "Primary", "Secondary", "Independent", "Special"];
const ofstedRatings = [
  "All",
  "Outstanding",
  "Good",
  "Requires Improvement",
  "Inadequate",
];

const mockResults: SchoolResult[] = [
  {
    id: "1",
    name: "Greenwood Primary Academy",
    type: "Primary School",
    rating: 4.8,
    distance: "0.3 miles",
    description:
      "Outstanding primary school with excellent STEM programs and small class sizes. Strong focus on individual learning and creative arts.",
    website: "www.greenwoodprimary.edu",
    phone: "020 7123 4567",
    address: "123 Oak Street, London, SW1A 1AA",
    ofstedRating: "Outstanding",
  },
  {
    id: "2",
    name: "St. Mary's Catholic School",
    type: "Primary School",
    rating: 4.6,
    distance: "0.5 miles",
    description:
      "Catholic primary school with strong community values and excellent pastoral care. Traditional approach with modern facilities.",
    website: "www.stmarys.edu",
    phone: "020 7234 5678",
    address: "456 Church Lane, London, SW1A 2BB",
    ofstedRating: "Good",
  },
  {
    id: "3",
    name: "Riverside Secondary School",
    type: "Secondary School",
    rating: 4.5,
    distance: "0.8 miles",
    description:
      "Comprehensive secondary school with strong academic results and diverse extracurricular activities. Excellent university preparation.",
    website: "www.riverside.edu",
    phone: "020 7345 6789",
    address: "789 River Road, London, SW1A 3CC",
    ofstedRating: "Good",
  },
  {
    id: "4",
    name: "Oakfield Independent School",
    type: "Independent School",
    rating: 4.9,
    distance: "1.2 miles",
    description:
      "Private school offering small class sizes, extensive facilities, and personalized learning approaches. Strong academic track record.",
    website: "www.oakfield.edu",
    phone: "020 7456 7890",
    address: "321 Park Avenue, London, SW1A 4DD",
    fees: "£15,000/year",
    ofstedRating: "Outstanding",
  },
];

export default function ClassicSearch({
  mode,
  onToggleMode,
}: ClassicSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [schoolType, setSchoolType] = useState("All");
  const [ofstedRating, setOfstedRating] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<SchoolResult[]>(mockResults);

  const handleSearch = () => {
    // In a real app, this would make an API call
    console.log("Searching for:", {
      searchQuery,
      location,
      schoolType,
      ofstedRating,
    });
  };

  return (
    <div className="flex h-full flex-col w-full">
      {/* Search header */}
      <div className="border-b border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              School Search
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "classic"
                ? "Find schools using traditional search filters"
                : "AI-powered school search"}
            </p>
          </div>
          <button
            onClick={onToggleMode}
            className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
          >
            <MessageCircle className="h-4 w-4" />
            Switch to {mode === "classic" ? "AI Chat" : "Classic"}
          </button>
        </div>

        {/* Search inputs */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for schools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Location or postcode..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                showFilters
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background text-foreground hover:bg-secondary",
              )}
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button
              onClick={handleSearch}
              className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Search
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border border-border rounded-lg bg-muted/50">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  School Type
                </label>
                <select
                  value={schoolType}
                  onChange={(e) => setSchoolType(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {schoolTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Ofsted Rating
                </label>
                <select
                  value={ofstedRating}
                  onChange={(e) => setOfstedRating(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {ofstedRatings.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Found {results.length} schools in your area
          </p>
        </div>

        <div className="space-y-4">
          {results.map((school) => (
            <div
              key={school.id}
              className="border border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-card-foreground">
                      {school.name}
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                      {school.type}
                    </span>
                    {school.ofstedRating && (
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                          school.ofstedRating === "Outstanding"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : school.ofstedRating === "Good"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
                        )}
                      >
                        Ofsted: {school.ofstedRating}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {school.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{school.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{school.distance}</span>
                    </div>
                    {school.fees && (
                      <span className="text-primary font-medium">
                        {school.fees}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p>{school.address}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button className="p-2 rounded-lg hover:bg-secondary group">
                    <Bookmark className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-secondary group">
                    <Phone className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-secondary group">
                    <Globe className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
