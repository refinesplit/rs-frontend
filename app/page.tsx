import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Benefits } from "@/components/landing/Benefits";
import { PricingSection } from "@/components/landing/PricingSection";

type QueryValue = string | string[] | undefined;

type HomePageProps = {
  searchParams?: Promise<Record<string, QueryValue>>;
};

function pickFirst(value: QueryValue): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = (await searchParams) ?? {};
  const regionFromUrl =
    pickFirst(params.region) ?? pickFirst(params.locale) ?? pickFirst(params.local);

  return (
    <>
      <Header />
      <main>
        <Hero region={regionFromUrl} />
        <HowItWorks />
        <Benefits />
        <PricingSection region={regionFromUrl} />
      </main>
      <Footer />
    </>
  );
}
