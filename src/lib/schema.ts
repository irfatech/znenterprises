export function authorNode(name: string, orgId: string) {
  const trimmed = name.trim();
  const isOrganization = /enterprises|company|corporation|inc\.?|ltd\.?|pvt|private limited/i.test(trimmed);
  if (isOrganization) {
    return { "@type": "Organization", "@id": orgId, name: trimmed };
  }
  return { "@type": "Person", name: trimmed };
}

function parseDmsCoordinates(input: string): { latitude: number; longitude: number } | null {
  const re = /(\d+)\s*°\s*(\d+)\s*'\s*([\d.]+)\s*"?\s*([NS]),?\s*(\d+)\s*°\s*(\d+)\s*'\s*([\d.]+)\s*"?\s*([EW])/i;
  const m = input.match(re);
  if (!m) return null;
  const latDeg = parseFloat(m[1]);
  const latMin = parseFloat(m[2]);
  const latSec = parseFloat(m[3]);
  const lngDeg = parseFloat(m[5]);
  const lngMin = parseFloat(m[6]);
  const lngSec = parseFloat(m[7]);
  let latitude = latDeg + latMin / 60 + latSec / 3600;
  let longitude = lngDeg + lngMin / 60 + lngSec / 3600;
  if (m[4].toUpperCase() === "S") latitude *= -1;
  if (m[8].toUpperCase() === "W") longitude *= -1;
  return { latitude, longitude };
}

export function placeNode(location: string) {
  const coords = parseDmsCoordinates(location);
  if (coords) {
    return {
      "@type": "Place",
      name: location,
      geo: {
        "@type": "GeoCoordinates",
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
    };
  }
  return { "@type": "Place", name: location };
}

export function quoteOffer(url: string, orgId: string, note = "Custom quote on request") {
  return {
    "@type": "Offer",
    url,
    priceCurrency: "INR",
    priceSpecification: {
      "@type": "PriceSpecification",
      price: "0",
      priceCurrency: "INR",
      valueAddedTaxIncluded: true,
      description: note,
    },
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@id": orgId },
  };
}