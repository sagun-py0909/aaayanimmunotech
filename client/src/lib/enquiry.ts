// Both public quotation forms post here, and the enquiry lands in the lead desk at /crm.

export type EnquiryPayload = {
  name: string;
  email: string;
  company?: string;
  city?: string;
  phone?: string;
  sector?: string;
  interest?: string;
  message?: string;
  shortlist?: string[];
  website?: string;
};

export async function sendEnquiry(payload: EnquiryPayload) {
  const response = await fetch("/api/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (response.status === 429) throw new Error("rate-limited");
  if (!response.ok) throw new Error("failed");
  return true;
}

/** Reads a form by input name, so the markup stays the source of truth for the fields. */
export const enquiryFromForm = (form: HTMLFormElement): EnquiryPayload => {
  const data = new FormData(form);
  const text = (key: string) => String(data.get(key) ?? "").trim();
  return {
    name: text("name"),
    email: text("email"),
    company: text("company"),
    city: text("city"),
    phone: text("phone"),
    sector: text("sector"),
    interest: text("interest"),
    message: text("message"),
    website: text("website"),
  };
};
