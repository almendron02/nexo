import Link from "next/link";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";

export function FeatureAccessResolution({ feature, description }: { feature: string; description: string }) {
  return <main className="access-page"><div className="access-page__mark"><LockKeyhole aria-hidden="true" /></div><p className="eyebrow">Spanish Foundations · Course access</p><h1>{feature} is part of the complete course.</h1><p>{description}</p><div className="access-page__actions"><Link className="button button--dark" href="/plans">See course access <ArrowRight aria-hidden="true" /></Link><Link className="access-page__back" href="/dashboard"><ArrowLeft aria-hidden="true" /> Return to Dashboard</Link></div></main>;
}
