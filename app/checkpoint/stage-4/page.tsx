import { ProtectedCheckpoint } from "@/components/ProtectedCheckpoint";
import { stage04Checkpoint } from "@/content/spanish-foundations/stages-02-04";

export default function StageFourCheckpointPage() {
  return <ProtectedCheckpoint lesson={stage04Checkpoint} stage={4} />;
}
