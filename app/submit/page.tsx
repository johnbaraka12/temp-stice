import type { Metadata } from "next";
import SubmissionForm from "./submission-form";

export const metadata: Metadata = {
  title: "Submit a Contribution",
  description: "Submit a paper, policy brief, evidence synthesis or innovation showcase for COSTECH@40 Summit.",
};

export default function SubmitPage() {
  return <SubmissionForm />;
}
