import { ProtectedCheckpoint } from "@/components/ProtectedCheckpoint";
import { stage03Checkpoint } from "@/content/spanish-foundations/stages-02-04";

export default function StageThreeCheckpointPage() {
  return <ProtectedCheckpoint lesson={stage03Checkpoint} stage={3} />;
}
